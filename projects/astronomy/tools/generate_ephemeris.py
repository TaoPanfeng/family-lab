#!/usr/bin/env python3
"""Build offline apparent geocentric Sun/Moon ephemerides. AGPL-3.0-or-later.

Optional data regeneration only; running the web app DOES NOT need Python.
Requires numpy and pyswisseph==2.10.3.2. Uses the built-in Moshier theory
explicitly, not Swiss/JPL binary data. Coordinates: true equator/equinox of date.
No purchased or downloaded Astrodienst ephemeris tables are redistributed.
"""
from pathlib import Path
import numpy as np
import swisseph as swe
import json, time

ROOT = Path(__file__).resolve().parents[1]
STEP, DEGREE = 4.0, 8
START = swe.julday(1899, 12, 28, 0.0)
END = swe.julday(2101, 1, 5, 0.0)
N = int(np.ceil((END - START) / STEP))
flags = swe.FLG_MOSEPH | swe.FLG_EQUATORIAL | swe.FLG_XYZ
angles = np.pi * (np.arange(DEGREE + 1) + .5) / (DEGREE + 1)
x = np.cos(angles)
basis = 2.0 / (DEGREE + 1) * np.cos(np.arange(DEGREE + 1)[:, None] * angles)
basis[0] *= .5

def sample(jd):
    sun, f = swe.calc_ut(float(jd), swe.SUN, flags)
    moon, f2 = swe.calc_ut(float(jd), swe.MOON, flags)
    assert f & swe.FLG_MOSEPH and f2 & swe.FLG_MOSEPH
    nut, _ = swe.calc_ut(float(jd), swe.ECL_NUT, swe.FLG_MOSEPH)
    return [*sun[:3], *moon[:3], nut[0], nut[2] * np.cos(np.radians(nut[0]))]

if __name__ == '__main__':
    t0 = time.time()
    data = np.empty((N, 8, DEGREE + 1), dtype='<f4')
    for seg in range(N):
        times = START + (seg + (x + 1) / 2) * STEP
        values = np.asarray([sample(t) for t in times])
        data[seg] = (basis @ values).T
        if seg % 4000 == 0:
            print(f'{seg}/{N} segments; {time.time()-t0:.1f}s', flush=True)
    (ROOT / 'data').mkdir(exist_ok=True)
    data.tofile(ROOT / 'data/ephemeris.f32')
    meta = dict(startJD=START, stepDays=STEP, degree=DEGREE, channels=8,
                segments=N, byteOrder='little-endian', dtype='float32',
                source='Swiss Ephemeris 2.10.03 / Moshier via pyswisseph 2.10.3.2',
                frame='apparent geocentric true equator/equinox of date (EQD)',
                fields=['Sun.x AU', 'Sun.y AU', 'Sun.z AU', 'Moon.x AU', 'Moon.y AU',
                        'Moon.z AU', 'true obliquity degrees', 'equation of equinoxes degrees'],
                userRangeUTC=['1900-01-01T00:00:00Z','2100-12-31T23:59:59Z'])
    rng = np.random.default_rng(20261016)
    errs, dist_errs = [[], []], [[], []]
    for _ in range(4000):
        seg = int(rng.integers(0, N))
        t = float(rng.uniform(-1, 1))
        exact = np.array(sample(START + (seg + (t+1)/2) * STEP))
        interp = np.array([np.polynomial.chebyshev.chebval(t, c.astype(float)) for c in data[seg]])
        for b in range(2):
            a, c = exact[b*3:b*3+3], interp[b*3:b*3+3]
            angle = np.arctan2(np.linalg.norm(np.cross(a, c)), np.dot(a, c))
            errs[b].append(float(np.degrees(angle)*3600))
            dist_errs[b].append(float(abs(np.linalg.norm(a)-np.linalg.norm(c))*149597870.7))
    report = dict(samples=4000, randomSeed=20261016,
                  maxAngleErrorArcsec={'sun':max(errs[0]), 'moon':max(errs[1])},
                  maxDistanceErrorKm={'sun':max(dist_errs[0]),'moon':max(dist_errs[1])},
                  note='Interpolation residual only, NOT total astronomical or eclipse accuracy.')
    meta['interpolationValidation'] = report
    (ROOT/'data/ephemeris.meta.json').write_text(json.dumps(meta, indent=2), encoding='utf-8')
    (ROOT/'tests/interpolation-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2), flush=True)
    print(f'Done in {time.time()-t0:.1f}s; {data.nbytes:,} bytes', flush=True)
