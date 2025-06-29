#!/bin/bash

# 登录页面小程序启动脚本
# 用于快速启动本地开发服务器

echo "=================================================="
echo "🎯 登录页面小程序启动器"
echo "📄 模仿 '上线了' 网站登录页面"
echo "=================================================="

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python3"
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 当前目录: $SCRIPT_DIR"
echo "🚀 启动开发服务器..."
echo ""

# 启动Python HTTP服务器
python3 start.py