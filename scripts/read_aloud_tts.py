"""Kokoro text-to-speech for add_read_aloud.py. Needs the ~/kokoro-tts venv (see that script).

Each unit is a list of parts, [['t', 'text'], ['b', None], ...]. Text parts are spoken as written;
a blank part is the plain word "blank", in the same voice. The result is one MP3 per unit, mono, 24 kHz, 40 kbps.
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

    def say(self, text, speed):
        audio, sr = self.k.create(text, voice=self.cfg['voice'], speed=speed, lang='en-us')
        assert sr == SR, sr
        return _peak(_trim(np.asarray(audio, dtype=np.float32)))

    def make(self, parts, out_path):
        """One MP3 for one unit. A blank is just the word "blank" inside the sentence, so the voice
        reads it exactly like the words around it."""
        cfg = self.cfg
        silence = lambda sec: np.zeros(int(sec * SR), dtype=np.float32)
        text = ' '.join('blank' if kind == 'b' else t.strip() for kind, t in parts)
        pcm = np.concatenate([silence(cfg['lead']), self.say(text, cfg['speed']), silence(cfg['tail'])])
        pcm = pcm.astype('<f4').tobytes()
        tmp = out_path + '.part'
        mp3 = _ffmpeg(['-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame',
                       '-b:a', '40k', '-ar', str(SR), '-ac', '1', '-f', 'mp3', 'pipe:1'], pcm)
        with open(tmp, 'wb') as f:
            f.write(mp3)
        os.replace(tmp, out_path)
        return len(pcm) / 4 / SR
