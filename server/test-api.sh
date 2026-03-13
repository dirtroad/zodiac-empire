#!/bin/bash

# ============================================
# API 测试脚本
# 用于快速测试后端API接口
# ============================================

BASE_URL="http://localhost:3000/v1"
TOKEN=""

echo "=========================================="
echo "星座帝国 - API 测试脚本"
echo "=========================================="
echo ""

# 测试服务器是否运行
echo "1. 测试服务器状态..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auth/wechat/login
echo ""
echo ""

# 测试登录
echo "2. 测试微信登录..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/wechat/login \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}')
echo $LOGIN_RESPONSE | python3 -m json.tool 2>/dev/null || echo $LOGIN_RESPONSE

# 提取token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "Token: ${TOKEN:0:20}..."
echo ""

# 测试获取用户信息
echo "3. 测试获取用户信息..."
curl -s -X GET $BASE_URL/users/me \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取星系列表
echo "4. 测试获取星系列表..."
curl -s -X GET $BASE_URL/galaxies \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# 测试创建星系
echo "5. 测试创建星系..."
curl -s -X POST $BASE_URL/galaxies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"测试星系","type":1}' | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取装备列表
echo "6. 测试获取装备列表..."
curl -s -X GET $BASE_URL/equipment \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取五行关系
echo "7. 测试获取五行关系..."
curl -s -X GET $BASE_URL/wuxing/relations | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取时空晶体余额
echo "8. 测试获取时空晶体余额..."
curl -s -X GET $BASE_URL/time-crystal/balance \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取星座地图
echo "9. 测试获取星座地图..."
curl -s -X GET $BASE_URL/map/constellation \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# 测试获取排行榜
echo "10. 测试获取战斗排行榜..."
curl -s -X GET $BASE_URL/battle/ranking | python3 -m json.tool 2>/dev/null
echo ""

echo "=========================================="
echo "测试完成！"
echo "=========================================="