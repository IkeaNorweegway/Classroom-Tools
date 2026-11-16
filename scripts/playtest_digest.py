#!/usr/bin/env python3
"""Turn a night of CEFL Town v2 plays (scripts/playtest_town2.sh OUTDIR …) into one readable OUTDIR/digest.md.

  python3 scripts/playtest_digest.py OUTDIR

Sections: the plays and how they ended; the script of the first play (every box, goal, banner and toast);
lines the other plays reached that the first didn't (other branches); lines flagged by simple rules (long boxes,
leftover %s / {name} / null); walking problems, each once with where it was seen; map pictures (each map once,
plus any picture with a problem); stop-and-resume checks. Read by the playtest agent (.claude/agents/playtest.md).
"""
import json
import re
import sys
from pathlib import Path

NOISE = ("ObjectDB instances were leaked", "resources still in use at exit", "at: cleanup", "at: clear (core/io")


def jl(path):
    if not path.exists():
        return []
    return [json.loads(l) for l in path.read_text().splitlines() if l.strip()]


def auto_result(d):
    m = re.search(r"AUTO-RESULT (\{.*\})", (d / "stdout.txt").read_text() if (d / "stdout.txt").exists() else "")
    return json.loads(m.group(1)) if m else None


def errors(d):
    p = d / "stdout.txt"
    if not p.exists():
        return ["no stdout.txt"]
    out = []
    for l in p.read_text().splitlines():
        if ("ERROR" in l or "WARNING" in l or "SCRIPT ERROR" in l or l.strip().startswith("at:")) and not any(n in l for n in NOISE):
            out.append(l.strip())
        if l.startswith("exit ") and l.strip() not in ("exit 0", "exit"):
            out.append(l.strip())
    return out


LAST_GOAL = {"text": None}


def box_line(e):
    k = e["kind"]
    where = f'{e.get("step")} · day {e.get("day")} {e.get("time")} · {e.get("map")}'
    if k in ("say", "choose", "say-update", "choose-update"):
        s = f'{e.get("speaker", "")}: {e.get("text", "")}'
        if e.get("options"):
            s += "  →  " + " | ".join(e["options"])
            if "picked" in e:
                s += f'  [picked {e["picked"] + 1}]'
        return where, s
    if k == "goal":
        reached = not e.get("target") and e.get("text") == LAST_GOAL["text"]
        LAST_GOAL["text"] = e.get("text")
        if reached:
            return where, "(goal reached)"
        return where, f'GOAL: "{e.get("text", "")}" → {e.get("target") or "(no target)"}'
    if k in ("banner", "screen-text"):
        return where, f'{k.upper()}: {e.get("text", "")}'
    if k == "step":
        return where, f'--- step {e.get("step")} (cash {e.get("cash", 0) / 100:.2f}, flags {e.get("flags")})'
    if k == "map":
        return where, f'(now in {e.get("name")}, standing at {e.get("me")}; the test player jumps between places, walking is checked separately)'
    if k in ("stuck", "timeout"):
        return where, f'!! {k.upper()}: {e.get("note")}'
    lines = e.get("lines", [])
    return where, f'[{k}] ' + " ¶ ".join(lines)


def flags_for(text):
    """Simple reading checks on one spoken line (not its choice options)."""
    out = []
    words = len(re.findall(r"[A-Za-z0-9$'’.,-]+", text))
    sentences = len(re.findall(r"[.!?](\s|$)", text.replace("...", "…")))
    if words > 25:
        out.append(f"{words} words")
    if sentences > 3:
        out.append(f"{sentences} sentences")
    for tok in ("%s", "%d", "{name}", "null", "<null>", "Nil", "res://"):
        if tok in text:
            out.append(f"leftover {tok}")
    return out


def main():
    out = Path(sys.argv[1]).resolve()
    plays = sorted((p.parent for p in out.glob("**/summary.json")), key=lambda d: (d.parent != out, str(d)))   # unbroken plays first
    md = [f"# Play-through digest · {out.name}", ""]
    if (out / "version.txt").exists():
        md += ["Game version: " + (out / "version.txt").read_text().strip().replace("\n", "; "), ""]

    md += ["## Plays", ""]
    for d in plays:
        s = json.loads((d / "summary.json").read_text())
        r = auto_result(d)
        name = str(d.relative_to(out))
        res = "finished" if s.get("finished") else f'stopped at step {s.get("step_index")}'
        if r:
            res += f' · ending {r.get("ending")} · profit {r.get("total_profit", 0) / 100:.2f} · days ' + ", ".join(
                f'{x["profit"] / 100:.2f}/rep {x["rep"]}' for x in r.get("days", []))
        md.append(f"- **{name}**: {res} · boxes {s.get('boxes')} · walking problems {s.get('nav_problems')} · stuck {s.get('stuck_events')}")
        for p in s.get("picks", []):
            md.append(f'  - picked option {p["picked"] + 1} at {p["step"]}: "{p["text"]}"')
        for e in errors(d):
            md.append(f"  - console: {e}")
    md.append("")

    seen = set()
    flagged = []
    for i, d in enumerate(plays):
        rows = []
        for e in jl(d / "transcript.jsonl"):
            where, s = box_line(e)
            key = re.sub(r"\$[0-9,.]+|\b\d+\b", "#", s)   # same line with other numbers counts as seen
            if e["kind"] in ("say", "choose", "goal"):
                f = flags_for(e.get("text", "")) + [x for o in e.get("options", []) for x in flags_for(o) if "leftover" in x]
                if f:
                    flagged.append((", ".join(f), where, s, key))
            if i == 0 or key not in seen:
                rows.append(f"- `{where}` {s}")
            seen.add(key)
        if i == 0:
            md += [f"## Script of the first play ({d.relative_to(out)})", ""] + rows + [""]
        elif rows:
            md += [f"## New lines in {d.relative_to(out)} (not in earlier plays)", ""] + rows + [""]

    md += ["## Lines flagged by simple rules", ""]
    done = set()
    for f, where, s, key in flagged:
        if key in done:
            continue
        done.add(key)
        md.append(f"- {f} · `{where}` {s}")
    if not done:
        md.append("- none")
    md.append("")

    md += ["## Walking problems (each once)", ""]
    probs = {}
    for d in plays:
        for e in jl(d / "nav.jsonl"):
            for p in e.get("problems", []):
                key = (e.get("map", e["where"]["map"]), p)
                probs.setdefault(key, set()).add(f'{e["where"]["step"]}')
    for (m, p), steps in sorted(probs.items()):
        st = sorted(steps)
        md.append(f"- **{m}**: {p} (at {len(st)} steps: {', '.join(st[:4])}{'…' if len(st) > 4 else ''})")
    if not probs:
        md.append("- none")
    md.append("")

    gat = {}
    for d in plays:
        for e in jl(d / "nav.jsonl"):
            for fl, n in (e.get("gated") or {}).items():
                gat[(e.get("map", e["where"]["map"]), fl)] = n
    if gat:
        md += ["## Expected (not problems)", ""]
        for (m, fl), n in sorted(gat.items()):
            md.append(f"- **{m}**: {n} tiles behind the {fl} gate, unreachable until that sigil is collected (expected)")
        md.append("")

    md += ["## Map pictures", "", "Key: `#` blocked · `~` water · `.` open · `:` path/walk/plaza · `=` road · `+` door · `>` edge · `E` room exit · `@` you · `T` thing · capital = person's first letter · `?` open but unreachable · `g` unreachable until a sigil opens a gate (expected) · `!` problem", ""]
    shown_maps, shown_pics = set(), set()
    if plays:
        for block in (plays[0] / "maps.txt").read_text().split("\n\n"):
            if not block.strip():
                continue
            head, body = block.split("\n", 1)
            mid = head.split(" ")[1]
            if (mid not in shown_maps or "!" in body) and body not in shown_pics:
                shown_maps.add(mid)
                shown_pics.add(body)
                md += ["```", head, body, "```", ""]

    md += ["## Stop and resume", ""]
    any_sr = False
    for a in out.glob("*/a"):
        any_sr = True
        b, c = a.parent / "b", a.parent / "c"
        rb, rc = auto_result(b), auto_result(c)
        if rb is None:
            md.append(f"- {a.parent.name}: resumed game did not finish")
        elif rc is None:
            md.append(f"- {a.parent.name}: resumed and finished (no unbroken run to compare)")
        else:
            same = {k: v for k, v in rb.items() if k not in ("log",)} == {k: v for k, v in rc.items() if k not in ("log",)}
            md.append(f"- {a.parent.name}: resumed result {'matches' if same else 'DIFFERS from'} the unbroken run")
            if not same:
                md.append(f"  - resumed: {json.dumps(rb)}\n  - unbroken: {json.dumps(rc)}")
            gb = [e.get("text") for e in jl(b / "transcript.jsonl") if e["kind"] == "goal"]
            gc = [e.get("text") for e in jl(c / "transcript.jsonl") if e["kind"] == "goal"]
            if gb and gc and gb[-len(gb):] != gc[-len(gb):]:
                md.append("  - goal texts after the resume differ from the unbroken run")
    if not any_sr:
        md.append("- none tonight")
    md.append("")
    (out / "digest.md").write_text("\n".join(md))
    print(out / "digest.md")


if __name__ == "__main__":
    main()
