#!/bin/bash

pnpm install 
# 清理缓存
echo "🧹 清理缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 重新安装依赖（可选，如果遇到依赖问题时使用）
# echo "📦 重新安装依赖..."
# pnpm install

# 启动开发服务器
echo "🚀 启动开发服务器..."
pnpm dev 