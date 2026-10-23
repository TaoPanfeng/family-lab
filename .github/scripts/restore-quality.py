#!/usr/bin/env python3
"""Restore the checksum-verified, previously reviewed local quality refactor."""
from __future__ import annotations
import argparse
import hashlib
import json
import lzma
from pathlib import Path, PurePosixPath
import subprocess
import tempfile
import urllib.request

ROOT = Path.cwd().resolve()
STATE = ROOT / '.quality-restored.json'
GENERATED = ['index.html', 'source.html', 'projects/physics/index.html', 'projects/physics/BUILD_MANIFEST.json']


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def safe_path(name: str) -> Path:
    p = PurePosixPath(name)
    if p.is_absolute() or '..' in p.parts or '\\' in name or not p.parts:
        raise RuntimeError('Unsafe file path: ' + name)
    if any(part.startswith('.') for part in p.parts):
        raise RuntimeError('Hidden/control paths cannot be restored: ' + name)
    path = ROOT.joinpath(*p.parts)
    if not path.resolve().is_relative_to(ROOT) or path.is_symlink():
        raise RuntimeError('File escapes repository: ' + name)
    return path


def restore(fixture_dir: Path | None) -> None:
    import shapefile
    manifest = json.loads((ROOT / '.maintenance/quality/ready.json').read_text())
    subprocess.run(['git', 'merge-base', '--is-ancestor', manifest['base'], 'HEAD'], check=True)
    parts = []
    for i, item in enumerate(manifest['parts']):
        expected = f'.maintenance/quality/part-{i:02}.xz'
        if item['path'] != expected:
            raise RuntimeError('Unexpected transfer part')
        data = (ROOT / expected).read_bytes()
        blob_sha = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        if len(data) != item['size'] or blob_sha != item['sha']:
            raise RuntimeError('Transfer part checksum mismatch: ' + expected)
        parts.append(data)
    compressed = b''.join(parts)
    if digest(compressed) != manifest['archive_sha256']:
        raise RuntimeError('Compressed source checksum mismatch')
    raw = lzma.decompress(compressed, memlimit=256 * 1024 * 1024)
    if len(raw) > 4 * 1024 * 1024 or digest(raw) != manifest['raw_sha256']:
        raise RuntimeError('Source payload checksum mismatch')
    bundle = json.loads(raw)
    pending = {}
    for entry in bundle['changes']:
        name = entry['path']
        path = safe_path(name)
        if name in pending:
            raise RuntimeError('Duplicate file: ' + name)
        if entry['old'] is None:
            if path.exists():
                raise RuntimeError('New file already exists: ' + name)
            old = ''
        else:
            data = path.read_bytes()
            if digest(data) != entry['old']:
                raise RuntimeError('Base file changed: ' + name)
            old = data.decode('utf-8')
        chunks = []
        for operation in entry['ops']:
            if isinstance(operation, str):
                chunks.append(operation)
            elif (isinstance(operation, list) and len(operation) == 2
                  and all(isinstance(n, int) for n in operation)
                  and 0 <= operation[0] <= operation[1] <= len(old)):
                chunks.append(old[operation[0]:operation[1]])
            else:
                raise RuntimeError('Invalid delta: ' + name)
        result = ''.join(chunks).encode('utf-8')
        if digest(result) != entry['new']:
            raise RuntimeError('Restored file checksum mismatch: ' + name)
        pending[name] = result

    # Build-time only: exact public-domain snapshot, not runtime network loading.
    country = bundle['countries']
    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        for name, expected in country['files'].items():
            if name not in {'naturalearth_lowres.shp', 'naturalearth_lowres.shx', 'naturalearth_lowres.dbf'}:
                raise RuntimeError('Unexpected geography fixture')
            if fixture_dir:
                data = (fixture_dir / name).read_bytes()
            else:
                url = ('https://raw.githubusercontent.com/geopandas/pyogrio/v0.12.1/'
                       'pyogrio/tests/fixtures/naturalearth_lowres/' + name)
                req = urllib.request.Request(url, headers={'User-Agent': 'Family-Lab-Verified-Restore'})
                with urllib.request.urlopen(req, timeout=45) as response:
                    data = response.read()
            if digest(data) != expected:
                raise RuntimeError('Geography snapshot checksum mismatch: ' + name)
            (folder / name).write_bytes(data)
        reader = shapefile.Reader(str(folder / 'naturalearth_lowres.shp'))
        shapes = list(reader.iterShapes())
        if len(shapes) != len(country['meta']):
            raise RuntimeError('Country geometry count mismatch')
        def rounded(value):
            if isinstance(value, (list, tuple)):
                return [rounded(x) for x in value]
            return round(value, 3) if isinstance(value, float) else value
        features = []
        for metadata, shape in zip(country['meta'], shapes):
            geometry = shape.__geo_interface__
            item = dict(metadata)
            item['geometry'] = {'type': geometry['type'], 'coordinates': rounded(geometry['coordinates'])}
            features.append(item)
        output = (country['prefix'] + 'window.GeoCountries=' +
                  json.dumps(features, ensure_ascii=False, separators=(',', ':')) + ';\n').encode()
        if digest(output) != country['output_sha256']:
            raise RuntimeError('Generated countries.js differs from reviewed delivery')
        pending['projects/geography/countries.js'] = output
        reader.close()
    for name, data in pending.items():
        path = safe_path(name)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    STATE.write_text(json.dumps({name: digest(data) for name, data in pending.items()}, ensure_ascii=False))
    print(f'Restored {len(pending)} byte-verified source files; no workflow or credential overwritten.')


def stage() -> None:
    files = json.loads(STATE.read_text())
    for name, expected in files.items():
        if digest(safe_path(name).read_bytes()) != expected:
            raise RuntimeError('Source changed during validation: ' + name)
    subprocess.run(['git', 'add', '--', *files, *GENERATED], check=True)
    subprocess.run(['git', 'rm', '-r', '--', '.maintenance/quality'], check=True)
    STATE.unlink()
    print('Staged verified source and deterministic offline output only.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['restore', 'stage'])
    parser.add_argument('--fixture-dir', type=Path)
    args = parser.parse_args()
    restore(args.fixture_dir) if args.command == 'restore' else stage()
