"""Kokoro text-to-speech for add_read_aloud.py. Needs the ~/kokoro-tts venv (see that script).

Each unit is a list of parts, [['t', 'text'], ['b', None], ...]. Text parts are spoken in the
normal voice; a blank part is the word "blank", slower and lower, with a short gap either side.
The result is one MP3 per unit, mono, 24 kHz, 40 kbps.
"""
import os
import subprocess

import numpy as np

SR = 24000
PEAK = 0.9


def _trim(a, thr=0.012, keep=0.02):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a
    k = int(keep * SR)
    return a[max(0, idx[0] - k): idx[-1] + 1 + k]


def _peak(a):
    m = float(np.max(np.abs(a))) if len(a) else 0.0
    return a * (PEAK / m) if m > 0 else a


def _ffmpeg(args, data):
    p = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + args, input=data, stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError(p.stderr.decode('utf-8', 'replace'))
    return p.stdout


class Speaker:
    def __init__(self, kokoro_dir, cfg):
        from kokoro_onnx import Kokoro
        self.cfg = cfg
        self.k = Kokoro(os.path.join(kokoro_dir, 'models', 'kokoro-v1.0.onnx'),
                        os.path.join(kokoro_dir, 'models', 'voices-v1.0.bin'))
        self.blank = self._blank_clip()

    def say(self, text, speed):
        audio, sr = self.k.create(text, voice=self.cfg['voice'], speed=speed, lang='en-us')
        assert sr == SR, sr
        return _peak(_trim(np.asarray(audio, dtype=np.float32)))

    def _blank_clip(self):
        """The word 'blank': slower, and lowered in pitch without changing its speed."""
        a = self.say('blank', self.cfg['blank_speed'])
        pitch = self.cfg['blank_pitch']
        if abs(pitch - 1.0) > 1e-3:
            out = _ffmpeg(['-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'pipe:0',
                           '-af', f'rubberband=pitch={pitch}', '-f', 'f32le', '-ar', str(SR), '-ac', '1', 'pipe:1'],
                          a.astype('<f4').tobytes())
            a = _peak(_trim(np.frombuffer(out, dtype='<f4').copy()))
        return a

    def make(self, parts, out_path):
        cfg = self.cfg
        chunks = []
        silence = lambda s: np.zeros(int(s * SR), dtype=np.float32)
        chunks.append(silence(cfg['lead']))
        for i, (kind, text) in enumerate(parts):
            if kind == 'b':
                if len(chunks) > 1:
                    chunks.append(silence(cfg['gap_before']))
                chunks.append(self.blank)
                if i < len(parts) - 1:
                    chunks.append(silence(cfg['gap_after']))
            else:
                # a piece that runs into a blank should sound unfinished, not like the end of a sentence
                if i < len(parts) - 1 and parts[i + 1][0] == 'b' and text[-1:] not in ',.;:!?':
                    text += ','
                chunks.append(self.say(text, cfg['speed']))
        chunks.append(silence(cfg['tail']))
        pcm = np.concatenate(chunks).astype('<f4').tobytes()
        tmp = out_path + '.part'
        mp3 = _ffmpeg(['-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame',
                       '-b:a', '40k', '-ar', str(SR), '-ac', '1', '-f', 'mp3', 'pipe:1'], pcm)
        with open(tmp, 'wb') as f:
            f.write(mp3)
        os.replace(tmp, out_path)
        return len(pcm) / 4 / SR
