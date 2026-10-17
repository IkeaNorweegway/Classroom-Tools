"""Build the land layers for the Social 8/9 notes maps.

Reads Natural Earth (public domain) from scripts/data/natural-earth/:
    countries-50m.json, countries-110m.json   world-atlas@2.0.2 TopoJSON (cdn.jsdelivr.net/npm/world-atlas@2.0.2/)
    admin1-50m.geojson                        ne_50m_admin_1_states_provinces (natural-earth-vector v5.1.2)

Writes notes-packages/_visuals/_maps/<name>.svg: a few <path> elements (dg-land, dg-land-hi, ...)
that a fragment pulls in with <mapbase name="<name>"/> (see add_notes_visuals.py).
Also prints each map's place coordinates, for placing markers and labels in the fragment.

Usage:
    python3 -I scripts/build_social_maps.py            all maps
    python3 -I scripts/build_social_maps.py world      one map
"""
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "scripts" / "data" / "natural-earth"
OUT = ROOT / "notes-packages" / "_visuals" / "_maps"

NATO_1949 = ["United States of America", "Canada", "United Kingdom", "France", "Belgium", "Netherlands",
             "Luxembourg", "Norway", "Denmark", "Iceland", "Italy", "Portugal"]

# name: projection, bounds, size, layers [(class, selector)], places {label: (lat, lon)}
MAPS = {
    # Urbanization S1: displaced persons, Europe to Canada 1945-51
    "europe-canada": dict(
        src="countries-50m", proj="eq", lon=(-100, 36), lat=(36, 63), width=600,
        layers=[("dg-land", "*"), ("dg-land-hi", ["Canada"])],
        places={"Winnipeg": (49.9, -97.1), "Toronto": (43.65, -79.4), "Montreal": (45.5, -73.6),
                "Halifax": (44.65, -63.6), "Bremerhaven": (53.55, 8.58), "Germany": (51.0, 10.0),
                "Austria": (47.5, 14.5), "Italy": (42.5, 12.8), "Poland": (52.0, 19.5), "Ukraine": (49.0, 31.0),
                "Baltic": (56.8, 24.5), "Netherlands": (52.2, 5.5), "Naples": (40.85, 14.27),
                "Prairies": (52.0, -106.0)}),
    # WWII S2: campaigns
    "wwii-atlantic": dict(
        src="countries-50m", proj="eq", lon=(-70, 22), lat=(34, 59), width=600,
        layers=[("dg-land", "*"), ("dg-land-hi", ["Canada"])],
        places={"Halifax": (44.65, -63.6), "Liverpool": (53.4, -3.0), "Dieppe": (49.92, 1.08),
                "Normandy": (49.35, -0.6), "Sicily": (37.5, 14.2), "Ortona": (42.35, 14.4),
                "Netherlands": (52.3, 5.6), "Belgium": (50.8, 4.4)}),
    "wwii-hongkong": dict(
        src="countries-50m", proj="eq", lon=(104, 126), lat=(14, 32), width=120,
        layers=[("dg-land", "*")],
        places={"Hong Kong": (22.3, 114.17)}),
    # Postwar S2: world stage
    "world-nato": dict(
        src="countries-110m", proj="eq", lon=(-170, 180), lat=(-5, 80), width=600, lat0=40,
        layers=[("dg-land", "*"), ("dg-land-hi", NATO_1949)],
        places={"Kapyong": (37.85, 127.5), "Suez": (30.6, 32.3), "Ottawa": (45.4, -75.7),
                "Brussels": (50.85, 4.35), "Alaska": (64, -150), "Greenland": (72, -40)}),
    # Postwar S3: immigration sources
    "world-immigration": dict(
        src="countries-110m", proj="eq", lon=(-170, 180), lat=(-5, 80), width=600, lat0=40,
        layers=[("dg-land", "*"), ("dg-land-hi", ["Canada"])],
        places={"Toronto": (43.65, -79.4), "Vancouver": (49.3, -123.1), "Montreal": (45.5, -73.6),
                "Europe": (50, 15), "India": (22, 79), "China": (30, 112), "Hong Kong": (22.3, 114.2),
                "Vietnam": (15, 107), "Jamaica": (18.1, -77.3), "Trinidad": (10.5, -61.3),
                "Philippines": (13, 122)}),
    # Independence S1: Dominions 1931
    "world-dominions": dict(
        src="countries-110m", proj="eq", lon=(-170, 180), lat=(-50, 78), width=600, lat0=30,
        layers=[("dg-land", "*"),
                ("dg-land-hi", ["Canada", "Australia", "New Zealand", "South Africa", "Ireland", "United Kingdom"])],
        places={"London": (51.5, -0.1), "Ottawa": (45.4, -75.7), "Newfoundland": (48.8, -56.0),
                "Canberra": (-35.3, 149.1), "Wellington": (-41.3, 174.8), "Cape Town": (-33.9, 18.4),
                "Dublin": (53.35, -6.26)}),
    # Postwar S4: regions of Canada
    "canada-provinces": dict(
        src="admin1-50m", proj="lcc", lon=(-141, -52), lat=(41.5, 70), width=600,
        layers=[("dg-land", "*"), ("dg-land-hi", ["Alberta", "Saskatchewan"]), ("dg-fill-cold", ["Québec"])],
        places={"Alberta": (54.5, -114.5), "Saskatchewan": (54.0, -106.0), "Québec": (51.0, -72.0),
                "Ottawa": (45.4, -75.7), "Edmonton": (53.55, -113.5), "Calgary": (51.05, -114.07),
                "Montreal": (45.5, -73.6), "Regina": (50.45, -104.6)}),
}


# ── data ──────────────────────────────────────────────────────────────────────

def topo_features(name):
    topo = json.loads((DATA / f"{name}.json").read_text())
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        pts = []
        for i in idx:
            a = arcs[i] if i >= 0 else arcs[~i][::-1]
            pts.extend(a if not pts else a[1:])
        return pts

    feats = []
    for g in topo["objects"]["countries"]["geometries"]:
        polys = g.get("arcs", [])
        if g["type"] == "Polygon":
            polys = [polys]
        rings = [ring(r) for poly in polys for r in poly]
        feats.append((g.get("properties", {}).get("name", ""), rings))
    return feats


def geojson_features(name, admin="Canada"):
    d = json.loads((DATA / f"{name}.geojson").read_text())
    feats = []
    for f in d["features"]:
        if f["properties"]["admin"] != admin:
            continue
        geom = f["geometry"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        feats.append((f["properties"]["name"], [r for poly in polys for r in poly]))
    return feats


# ── projection ────────────────────────────────────────────────────────────────

def projector(spec):
    lon0, lon1 = spec["lon"]
    lat0, lat1 = spec["lat"]
    if spec["proj"] == "eq":
        c = math.cos(math.radians(spec.get("lat0", (lat0 + lat1) / 2)))
        k = spec["width"] / ((lon1 - lon0) * c)

        def f(lon, lat):
            return (lon - lon0) * c * k, (lat1 - lat) * k
        return f, k * (lat1 - lat0)

    # Lambert conformal conic, standard parallels 49 and 77 (Statistics Canada's choice), central meridian -96
    p1, p2, phi0, lam0 = map(math.radians, (49, 77, 40, -96))
    n = math.log(math.cos(p1) / math.cos(p2)) / math.log(math.tan(math.pi / 4 + p2 / 2) / math.tan(math.pi / 4 + p1 / 2))
    F = math.cos(p1) * math.tan(math.pi / 4 + p1 / 2) ** n / n
    r0 = F / math.tan(math.pi / 4 + phi0 / 2) ** n

    def raw(lon, lat):
        r = F / math.tan(math.pi / 4 + math.radians(lat) / 2) ** n
        t = n * (math.radians(lon) - lam0)
        return r * math.sin(t), -(r0 - r * math.cos(t))

    corners = [raw(lo, la) for lo in (lon0, -96, lon1) for la in (lat0, lat1)]
    xs = [p[0] for p in corners]
    ys = [p[1] for p in corners]
    k = spec["width"] / (max(xs) - min(xs))
    mx, my = min(xs), min(ys)

    def g(lon, lat):
        x, y = raw(lon, lat)
        return (x - mx) * k, (y - my) * k
    return g, (max(ys) - min(ys)) * k


# ── geometry ──────────────────────────────────────────────────────────────────

def clip(pts, xmin, ymin, xmax, ymax):
    """Sutherland-Hodgman against a rectangle."""
    def edge(pts, inside, cut):
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if inside(p):
                if not inside(q):
                    out.append(cut(q, p))
                out.append(p)
            elif inside(q):
                out.append(cut(q, p))
        return out

    def at_x(x):
        return lambda a, b: (x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]))

    def at_y(y):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y)

    for inside, cut in ((lambda p: p[0] >= xmin, at_x(xmin)), (lambda p: p[0] <= xmax, at_x(xmax)),
                        (lambda p: p[1] >= ymin, at_y(ymin)), (lambda p: p[1] <= ymax, at_y(ymax))):
        if not pts:
            break
        pts = edge(pts, inside, cut)
    return pts


def simplify(pts, tol):
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]
        bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy)
        best, bi = 0, -1
        for i in range(a + 1, b):
            # a closed ring starts and ends on one point: measure from that point instead
            d = (abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / L if L
                 else math.hypot(pts[i][0] - ax, pts[i][1] - ay))
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def area(pts):
    return abs(sum(pts[i - 1][0] * p[1] - p[0] * pts[i - 1][1] for i, p in enumerate(pts))) / 2


def path_d(rings, proj, w, h, tol, min_area):
    parts = []
    for r in rings:
        if any(abs(a[0] - b[0]) > 180 for a, b in zip(r, r[1:])):
            # ring crosses the antimeridian (Russia, Fiji): move its western half past +180 so it stays whole
            r = [(lon + 360 if lon < 0 else lon, lat) for lon, lat in r]
        pts = [proj(lon, lat) for lon, lat in r]
        pts = clip(pts, -2, -2, w + 2, h + 2)
        if len(pts) < 3:
            continue
        pts = simplify(pts + [pts[0]], tol)[:-1]
        if len(pts) < 3 or area(pts) < min_area:
            continue
        seg = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}" + "".join(
            f"l{b[0] - a[0]:.1f},{b[1] - a[1]:.1f}" for a, b in zip(pts, pts[1:]))
        parts.append(seg.replace(".0,", ",").replace(".0l", "l") + "z")
    return "".join(parts)


def build(name, spec):
    feats = geojson_features(spec["src"]) if spec["src"].startswith("admin1") else topo_features(spec["src"])
    proj, h = projector(spec)
    w = spec["width"]
    tol = spec.get("tol", 0.45 if w > 200 else 0.3)
    min_area = spec.get("min_area", 3 if w > 200 else 1)
    claimed = set()
    out = []
    for cls, sel in reversed(spec["layers"]):
        names = {n for n, _ in feats} - claimed if sel == "*" else set(sel)
        missing = set(names) - {n for n, _ in feats}
        if missing:
            sys.exit(f"{name}: no feature named {sorted(missing)}")
        rings = [r for n, rs in feats if n in names for r in rs]
        claimed |= names
        d = path_d(rings, proj, w, h, tol, min_area)
        if d:
            out.insert(0, f'<path class="{cls}" d="{d}"/>')
    OUT.mkdir(parents=True, exist_ok=True)
    body = "\n".join(out)
    (OUT / f"{name}.svg").write_text(
        f'<!-- map: {name} | Natural Earth (public domain) | {spec["proj"]} lon {spec["lon"]} lat {spec["lat"]} '
        f'| {w}x{h:.0f} | scripts/build_social_maps.py -->\n{body}\n', encoding="utf-8")
    places = {k: tuple(round(v, 1) for v in proj(lon, lat)) for k, (lat, lon) in spec["places"].items()}
    print(f"{name}: {w}x{h:.0f}, {len(body) // 1024} KB")
    for k, (x, y) in places.items():
        print(f"    {k:14s} {x:7.1f} {y:7.1f}")


def main(argv):
    names = argv or list(MAPS)
    for n in names:
        build(n, MAPS[n])


if __name__ == "__main__":
    main(sys.argv[1:])
