#!/bin/bash

# ============================================
# 星座帝国 - 开发环境安装脚本
# 适用于：macOS (Apple Silicon)
# ============================================

set -e

echo "🚀 开始安装开发环境..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否已安装
check_installed() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 已安装${NC}"
        return 0
    else
        echo -e "${YELLOW}✗ $1 未安装${NC}"
        return 1
    fi
}

# ============================================
# 1. 安装 pnpm
# ============================================
echo ""
echo "📦 安装 pnpm..."
if ! check_installed pnpm; then
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm 安装完成${NC}"
fi

# ============================================
# 2. 安装 Docker Desktop
# ============================================
echo ""
echo "🐳 检查 Docker Desktop..."
if ! check_installed docker; then
    echo -e "${YELLOW}Docker Desktop 需要手动安装${NC}"
    echo "请访问: https://www.docker.com/products/docker-desktop"
    echo "下载并安装 Docker Desktop for Mac"
    echo ""
    read -p "按回车继续..."
fi

# ============================================
# 3. 安装 VSCode
# ============================================
echo ""
echo "💻 检查 VSCode..."
if ! ls /Applications/ | grep -q "Visual Studio Code"; then
    echo -e "${YELLOW}正在安装 VSCode...${NC}"
    brew install --cask visual-studio-code
    echo -e "${GREEN}✓ VSCode 安装完成${NC}"
else
    echo -e "${GREEN}✓ VSCode 已安装${NC}"
fi

# ============================================
# 4. 安装 Cocos Creator
# ============================================
echo ""
echo "🎮 检查 Cocos Creator..."
if ! ls /Applications/ | grep -q "CocosCreator"; then
    echo -e "${YELLOW}Cocos Creator 需要手动安装${NC}"
    echo "请访问: https://www.cocos.com/creator"
    echo "下载 Cocos Creator 3.8.x 版本"
    echo ""
    read -p "按回车继续..."
fi

# ============================================
# 5. 安装微信开发者工具
# ============================================
echo ""
echo "📱 检查微信开发者工具..."
if ! ls /Applications/ | grep -q "wechatwebdevtools"; then
    echo -e "${YELLOW}正在安装微信开发者工具...${NC}"
    brew install --cask wechatwebdevtools
    echo -e "${GREEN}✓ 微信开发者工具安装完成${NC}"
else
    echo -e "${GREEN}✓ 微信开发者工具已安装${NC}"
fi

# ============================================
# 6. 启动数据库容器
# ============================================
echo ""
echo "🗄️ 启动数据库容器..."

if command -v docker &> /dev/null; then
    # 检查Docker是否运行
    if ! docker info &> /dev/null; then
        echo -e "${YELLOW}请先启动 Docker Desktop${NC}"
        read -p "启动后按回车继续..."
    fi
    
    # MySQL
    echo "启动 MySQL..."
    if ! docker ps -a | grep -q "zodiac-mysql"; then
        docker run -d \
            --name zodiac-mysql \
            -p 3306:3306 \
            -e MYSQL_ROOT_PASSWORD=root \
            -e MYSQL_DATABASE=zodiac_empire \
            -v zodiac_mysql_data:/var/lib/mysql \
            mysql:8
        echo -e "${GREEN}✓ MySQL 容器已创建${NC}"
    else
        docker start zodiac-mysql 2>/dev/null || true
        echo -e "${GREEN}✓ MySQL 容器已启动${NC}"
    fi
    
    # Redis
    echo "启动 Redis..."
    if ! docker ps -a | grep -q "zodiac-redis"; then
        docker run -d \
            --name zodiac-redis \
            -p 6379:6379 \
            -v zodiac_redis_data:/data \
            redis:7
        echo -e "${GREEN}✓ Redis 容器已创建${NC}"
    else
        docker start zodiac-redis 2>/dev/null || true
        echo -e "${GREEN}✓ Redis 容器已启动${NC}"
    fi
    
    # MongoDB
    echo "启动 MongoDB..."
    if ! docker ps -a | grep -q "zodiac-mongo"; then
        docker run -d \
            --name zodiac-mongo \
            -p 27017:27017 \
            -v zodiac_mongo_data:/data/db \
            mongo:7
        echo -e "${GREEN}✓ MongoDB 容器已创建${NC}"
    else
        docker start zodiac-mongo 2>/dev/null || true
        echo -e "${GREEN}✓ MongoDB 容器已启动${NC}"
    fi
else
    echo -e "${RED}✗ Docker 未安装，跳过数据库容器${NC}"
fi

# ============================================
# 7. 安装 VSCode 插件
# ============================================
echo ""
echo "🔌 安装 VSCode 插件..."

if command -v code &> /dev/null || ls /Applications/ | grep -q "Visual Studio Code"; then
    # 使用应用路径
    VSCODE_CLI="/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    
    if [ -f "$VSCODE_CLI" ]; then
        echo "安装 TypeScript Hero..."
        "$VSCODE_CLI" --install-extension rbbit.typescript-hero
        
        echo "安装 ESLint..."
        "$VSCODE_CLI" --install-extension dbaeumer.vscode-eslint
        
        echo "安装 Prettier..."
        "$VSCODE_CLI" --install-extension esbenp.prettier-vscode
        
        echo "安装 GitLens..."
        "$VSCODE_CLI" --install-extension eamodio.gitlens
        
        echo "安装 MySQL Client..."
        "$VSCODE_CLI" --install-extension cweijan.vscode-mysql-client2
        
        echo "安装 Redis Client..."
        "$VSCODE_CLI" --install-extension cweijan.vscode-redis-client
        
        echo -e "${GREEN}✓ VSCode 插件安装完成${NC}"
    else
        echo -e "${YELLOW}请手动安装 VSCode 插件${NC}"
        echo "打开 VSCode，按 Cmd+Shift+X，搜索安装："
        echo "  - TypeScript Hero"
        echo "  - ESLint"
        echo "  - Prettier"
        echo "  - GitLens"
        echo "  - MySQL"
        echo "  - Redis"
    fi
fi

# ============================================
# 8. 创建项目目录
# ============================================
echo ""
echo "📁 创建项目目录..."

PROJECT_DIR="$HOME/zodiac-empire"
mkdir -p "$PROJECT_DIR/server"
mkdir -p "$PROJECT_DIR/client"

echo -e "${GREEN}✓ 项目目录已创建: $PROJECT_DIR${NC}"

# ============================================
# 9. 安装全局工具
# ============================================
echo ""
echo "🔧 安装全局工具..."

# NestJS CLI
if ! command -v nest &> /dev/null; then
    echo "安装 NestJS CLI..."
    pnpm add -g @nestjs/cli
    echo -e "${GREEN}✓ NestJS CLI 安装完成${NC}"
fi

# PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    pnpm add -g pm2
    echo -e "${GREEN}✓ PM2 安装完成${NC}"
fi

# ============================================
# 完成
# ============================================
echo ""
echo "============================================"
echo -e "${GREEN}✅ 开发环境安装完成！${NC}"
echo "============================================"
echo ""
echo "📋 环境信息："
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  pnpm: $(pnpm -v)"
echo "  Git: $(git --version | cut -d' ' -f3)"
echo ""
echo "🗄️ 数据库信息："
echo "  MySQL: localhost:3306 (root/root)"
echo "  Redis: localhost:6379"
echo "  MongoDB: localhost:27017"
echo ""
echo "📁 项目目录: $PROJECT_DIR"
echo ""
echo "🚀 下一步："
echo "  1. 打开 Docker Desktop 确保数据库运行"
echo "  2. 打开 VSCode 安装剩余插件"
echo "  3. 下载安装 Cocos Creator 3.8.x"
echo "  4. 开始开发！"
echo ""