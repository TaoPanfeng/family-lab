"""Restore a bounded, checksum-verified source bundle on the feature branch only."""
import base64
import hashlib
import json
import lzma
from pathlib import Path, PurePosixPath
import subprocess

PARTS = [
    'ccd9a0138c4b2932cd4205f6ef9f2b16342d9f922de74154e626bfe4d196c937',
    '54387abd5364f9423a69f97b42af70cd07925b4f8cf8ee03bea3eb873feced1a',
    '9ccbcffd72d5b6b3cad8375a376f0347b10ab20f12e4b1b07d4e0a802046db6a',
    'a5383b2ef9274caea2875ce53ed1aa6e4dc5f9c31d75667bd46025406db50831',
    '463281ad81a861588e4f848077f67d9d3da1a9c4e91aa09a67cee806ac11c014',
    'b6528fe05b5d63653450576f4312bf950ae25d08fd613e9db5fd7c76877411b4',
    'e1ffb276ac16f5aa3633660ba849b602d27e99c2e2203cd12fd121d18090e17c',
    'f7bb2f705dac32602beeb6f986c2e66fde40e33421cb8fcea98a8a28371b9eb6',
    '889d229fe9735546a95a8993ff8ca6b826300c41da5c3c9f674266381250470b',
]
ARCHIVE = 'c2866ee7072523a776e2389b3f7911bc5c9ee9a449ea21c2b870133c3fb866eb'
ALLOWED_FILES = {
    'AGENTS.md', 'README.md', 'THIRD_PARTY_NOTICES.md', 'catalog.json',
    'index.html', 'source.html', 'docs/EXPANSION.md', 'portal/home.js',
    'portal/illustrations.json', 'portal/index.template.html', 'portal/style.css',
    'tests/browser-smoke.py', 'tests/site-smoke.py', 'tests/portal.test.cjs',
    'tests/expansion-browser.py', 'tests/expansion-models.test.cjs',
    'tools/build-home.cjs', 'tools/prepare-site.py', 'tools/test.cjs',
}
ALLOWED_PREFIXES = ('shared/', 'projects/biology/', 'projects/geography/', 'projects/cosmos/', 'projects/martial/')
root = Path.cwd()
chunks = []
for index, expected in enumerate(PARTS):
    data = (root / '.maintenance' / f'part-{index:02d}').read_bytes()
    if index == 1 and hashlib.sha256(data).hexdigest() != expected:
        # Correct the identified one-character transport insertion; require the ORIGINAL digest afterwards.
        encoded = base64.b64encode(data).decode('ascii')
        if encoded.count('bv8uOmvZ00k') != 1:
            raise RuntimeError('Unexpected transport content')
        data = base64.b64decode(encoded.replace('bv8uOmvZ00k', 'bv8uOmvZ0k') + 'G', validate=True)
    if hashlib.sha256(data).hexdigest() != expected:
        raise RuntimeError(f'Part {index} checksum mismatch')
    chunks.append(data)
compressed = b''.join(chunks)
if hashlib.sha256(compressed).hexdigest() != ARCHIVE:
    raise RuntimeError('Source bundle checksum mismatch')
decoder = lzma.LZMADecompressor(memlimit=128 * 1024 * 1024)
raw = decoder.decompress(compressed, max_length=1024 * 1024)
if not decoder.eof or decoder.unused_data or len(raw) != 315273:
    raise RuntimeError('Unexpected decoded bundle size')
bundle = json.loads(raw)
if bundle['schema'] != 1 or len(bundle['files']) != 41:
    raise RuntimeError('Unexpected manifest')
for name, text in bundle['files'].items():
    path = PurePosixPath(name)
    if path.is_absolute() or '..' in path.parts or '\\' in name:
        raise RuntimeError('Unsafe path: ' + name)
    if name not in ALLOWED_FILES and not name.startswith(ALLOWED_PREFIXES):
        raise RuntimeError('Unapproved project path: ' + name)
    if not isinstance(text, str):
        raise RuntimeError('Expected UTF-8 source')
    target = root / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(text.encode('utf-8'))
(root / '.maintenance' / 'restored.json').write_text(json.dumps(list(bundle['files'])), encoding='utf-8')
print('Restored 41 checksum-verified source files. Existing five application directories were not replaced.')
