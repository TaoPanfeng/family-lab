<!-- FAMILY_LAB_IMPORT_PENDING -->
# 万物 · 家庭探索馆

日月地、物理、化学、历史、坐卧：一个公共首页，五个独立项目，每个项目只保留当前版本。

> **当前状态：首次导入尚未完成。** 目前仓库只有导入脚本、测试/发布工作流和说明；五个项目的业务代码还未上传，网站也尚未发布。不要把工作流文件已提交当成整套项目已入库。

## 首次导入：只上传一次原始 ZIP

打开 [仓库上传页面](https://github.com/TaoPanfeng/family-lab/upload/main)，把本次对话提供的 **`family-lab.zip`** 原样上传到仓库根目录，并提交到 `main`。

- 不解压、不改文件名、不重新压缩；也不是分别上传五个旧 ZIP。
- 不需要安装 Git、配置 SSH、访问令牌或在本地执行 `push`。
- 这个归档约 19.41 MiB；导入器校验其 SHA-256：`29b7456e5f4f5b27dff37015faf512186e5a381f43075b6918273c2b4928ec9a`。

收到 ZIP 后，`Import Family Lab` 工作流按顺序校验、展开、构建、运行模型/DOM/浏览器测试。全部成功后才提交源码和可离线打开的成品，并把 ZIP 从当前工作树移除。Git 历史仍保留最初的 ZIP。测试失败不会伪装成导入成功，也不会强推覆盖分支。

导入器保留五个子项目的原始源码、图片、天文二进制数据、许可与测试材料；不创建 v1/v2 两套应用。归档内的旧 Pages 工作流不会覆盖仓库中已配置的工作流。

[查看导入运行记录](https://github.com/TaoPanfeng/family-lab/actions/workflows/import-family-lab.yml)

## 后续使用

导入成功后，首次 `git clone`；以后 `git pull --ff-only`，再打开根目录 `index.html`。无需 npm、Python 或本地服务器来使用项目。开发和测试工具只用于维护。

## 网站发布是独立状态

已配置测试及 Pages 发布工作流，但 **没有已验证的线上访问地址**。工作流只在仓库已启用 Pages、且发布源为 GitHub Actions 时部署，不会擅自公开私有仓库、改变账户计划或绕过审批。

[查看测试与发布记录](https://github.com/TaoPanfeng/family-lab/actions/workflows/pages.yml) · [Pages 设置](https://github.com/TaoPanfeng/family-lab/settings/pages)
