#!/usr/bin/env python3
"""One-time, checksum-verified import of the original Family Lab delivery."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import stat
import subprocess
import zipfile

EXPECTED_SHA256 = "29b7456e5f4f5b27dff37015faf512186e5a381f43075b6918273c2b4928ec9a"
STATE_NAME = ".family-lab-import-state.json"
SKIP_PATH = ".github/workflows/pages.yml"
# These two test runners intentionally rewrite timestamps and runtime metadata.
GENERATED_REPORTS = {
    "projects/astronomy/tests/test-report.json": 52,
    "projects/astronomy/tests/v2-report.json": 50,
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def extract(root: Path) -> None:
    archive = root / "family-lab.zip"
    if not archive.is_file():
        raise RuntimeError("Upload the original family-lab.zip to the repository root first.")
    if (root / "catalog.json").exists() or (root / "projects").exists():
        raise RuntimeError("Project files already exist. Refusing to overwrite an existing application.")
    if sha256(archive.read_bytes()) != EXPECTED_SHA256:
        raise RuntimeError("ZIP checksum mismatch. Upload the original delivery without repacking it.")
    pending: dict[str, bytes] = {}
    skipped = []
    with zipfile.ZipFile(archive) as bundle:
        if sum(item.file_size for item in bundle.infolist()) > 100 * 1024 * 1024:
            raise RuntimeError("Unexpected uncompressed archive size.")
        for item in bundle.infolist():
            if item.is_dir():
                continue
            name = PurePosixPath(item.filename)
            if name.is_absolute() or ".." in name.parts or "\\" in item.filename:
                raise RuntimeError("Unsafe archive path: " + item.filename)
            if len(name.parts) < 2 or name.parts[0] != "family-lab":
                raise RuntimeError("Unexpected archive root: " + item.filename)
            relative = PurePosixPath(*name.parts[1:])
            if relative.parts[0] == ".github":
                if str(relative) != SKIP_PATH:
                    raise RuntimeError("Unexpected workflow in archive: " + str(relative))
                skipped.append(str(relative))
                continue
            if any(part in {".git", ".ssh", "node_modules"} for part in relative.parts):
                raise RuntimeError("Forbidden archive entry: " + str(relative))
            if stat.S_ISLNK(item.external_attr >> 16):
                raise RuntimeError("Symbolic links are not accepted.")
            if str(relative) in pending:
                raise RuntimeError("Duplicate archive entry: " + str(relative))
            destination = (root / str(relative)).resolve()
            if not destination.is_relative_to(root):
                raise RuntimeError("Archive path escapes the repository.")
            data = bundle.read(item)
            if destination.exists():
                if str(relative) == "README.md" and "FAMILY_LAB_IMPORT_PENDING" in destination.read_text(encoding="utf-8"):
                    pass
                elif not destination.is_file() or destination.read_bytes() != data:
                    raise RuntimeError("Refusing to replace an existing file: " + str(relative))
            pending[str(relative)] = data
    required = {"index.html", "source.html", "catalog.json", "package.json", "AGENTS.md"}
    if not required.issubset(pending) or len(pending) != 232:
        raise RuntimeError("The original project archive is incomplete.")
    for relative, data in pending.items():
        destination = root / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
    state = {"archive_sha256": EXPECTED_SHA256,
             "files": {name: sha256(data) for name, data in pending.items()},
             "skipped_workflows": skipped}
    (root / STATE_NAME).write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Extracted {len(pending)} original files. Existing remote workflows were preserved.")


def verify(root: Path) -> dict:
    state = json.loads((root / STATE_NAME).read_text(encoding="utf-8"))
    for name, expected in state["files"].items():
        file = root / name
        if not file.is_file() or sha256(file.read_bytes()) != expected:
            raise RuntimeError("Original-file verification failed: " + name)
    print(f"Verified {len(state['files'])} original files, including offline HTML and binary resources.")
    return state


def preserve_current_reports(root: Path) -> None:
    """Keep fresh evidence separately, then restore only known baseline reports."""
    archive = root / "family-lab.zip"
    if sha256(archive.read_bytes()) != EXPECTED_SHA256:
        raise RuntimeError("ZIP checksum changed before final verification.")
    evidence = root / ".qa/import-browser"
    evidence.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive) as bundle:
        for name, expected_count in GENERATED_REPORTS.items():
            current = (root / name).read_bytes()
            result = json.loads(current)
            if result.get("passed") != expected_count or result.get("total") != expected_count or result.get("failed", 0) != 0:
                raise RuntimeError("The latest model test report is not passing: " + name)
            (evidence / ("astronomy-" + Path(name).name)).write_bytes(current)
            # Every source and runtime asset is still checked byte-for-byte below.
            (root / name).write_bytes(bundle.read("family-lab/" + name))
    print("Preserved the two fresh model reports; restored their original baseline copies.")


def finalize(root: Path) -> None:
    preserve_current_reports(root)
    state = verify(root)
    readme = root / "README.md"
    text = readme.read_text(encoding="utf-8")
    text = text.replace(
        "本包是本地整理结果，**不代表 GitHub 仓库已建立或网站已上线**。真实交付状态见 `docs/INTEGRATION_REPORT.md`。",
        "代码已导入此 GitHub 仓库；克隆后可直接打开根目录 `index.html`。**代码入库不等于网站上线**：部署状态请查看 Actions 和 Settings → Pages。原整合测试记录保留在 `docs/INTEGRATION_REPORT.md`，本次导入记录见 `docs/IMPORT_STATUS.md`。")
    readme.write_text(text, encoding="utf-8")
    run_url = f"https://github.com/{os.environ.get('GITHUB_REPOSITORY', 'TaoPanfeng/family-lab')}/actions/runs/{os.environ.get('GITHUB_RUN_ID', '')}"
    report = root / "docs/IMPORT_STATUS.md"
    report.write_text(
        "# GitHub 首次导入记录\n\n"
        f"原始归档 SHA-256：`{EXPECTED_SHA256}`。\n\n"
        f"{len(state['files'])} 个原始文件在构建后逐一校验通过。模型、数据、DOM 及真实 file:// 浏览器测试通过后，"
        "将两份带时间戳的天文测试报告单独存入本次 Actions artifact，再恢复原始基线报告并对全部原始文件重新校验。"
        "随后仅更新根 README 的交付状态。没有跳过源码、数据或离线成品校验。\n\n"
        "五个子项目的源码、离线成品、图片、数据、许可和原测试材料均保留，不建立第二套版本目录。\n\n"
        "原归档中的 Pages 工作流未覆盖远端工作流。上传用 ZIP 从当前工作树删除，仍保留在 Git 历史中。\n\n"
        f"本次运行记录：{run_url}\n\n"
        "此记录只证明代码导入、构建和测试；网站是否上线以 Pages 部署结果为准。\n",
        encoding="utf-8")
    subprocess.run(["git", "add", "--", *state["files"], "docs/IMPORT_STATUS.md"], cwd=root, check=True)
    subprocess.run(["git", "rm", "--", "family-lab.zip"], cwd=root, check=True)
    (root / STATE_NAME).unlink()
    print("Verified project staged. No workflow, credential, or test dependency was added by the importer.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["extract", "verify", "finalize"])
    parser.add_argument("--root", type=Path, default=Path.cwd())
    args = parser.parse_args()
    root = args.root.resolve()
    {"extract": extract, "verify": verify, "finalize": finalize}[args.command](root)


if __name__ == "__main__":
    main()
