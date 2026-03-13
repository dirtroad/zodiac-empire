#!/bin/bash

# ============================================
# 数据库初始化脚本
# ============================================

echo "=== 星座帝国 - 数据库初始化 ==="
echo ""

# 数据库配置
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASS="root"
DB_NAME="zodiac_empire"

# 检查MySQL容器是否运行
echo "检查数据库容器..."
if ! docker ps | grep -q "zodiac-mysql"; then
    echo "启动MySQL容器..."
    docker start zodiac-mysql
    sleep 5
fi

# 执行初始化脚本
echo "执行数据库初始化..."
docker exec -i zodiac-mysql mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME} < /Users/mac_sun/zodiac-empire/server/database/init.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 数据库初始化成功！"
    echo ""
    echo "已初始化数据："
    echo "  - 12星座配置"
    echo "  - 32个装备模板"
else
    echo ""
    echo "❌ 数据库初始化失败！"
fi