#!/bin/bash
set -e

REPO_URL="https://github.com/kang-oy/kang-tools.git"
CLONE_DIR="kang-tools"
SCRIPT_NAME="sync-from-repo.sh"

echo "1. 清理当前目录（保留本脚本及 .env 文件）..."
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name "$SCRIPT_NAME" ! -name '.env' ! -name '.env.*' -exec rm -rf {} +

echo ""
echo "2. 克隆仓库..."
git clone "$REPO_URL" "$CLONE_DIR"

echo ""
echo "3. 迁移文件到当前目录..."
mv -i "$CLONE_DIR"/* ./ 2>/dev/null || true
for f in "$CLONE_DIR"/.[!.]*; do
  [ -e "$f" ] && mv -i "$f" ./
done 2>/dev/null || true

echo ""
echo "4. 删除临时目录 kang-tools..."
rm -rf "$CLONE_DIR"

echo ""
echo "5. 安装依赖 (npm i)..."
npm i

echo "完成。"
