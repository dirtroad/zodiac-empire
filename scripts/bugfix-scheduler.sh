#!/bin/bash

# 星座帝国 - 自动 Bug 修复检查脚本
# 每 30 分钟运行一次

LOG_FILE=~/zodiac-empire/logs/bugfix-scheduler.log
WORKSPACE=~/zodiac-empire

mkdir -p ~/zodiac-empire/logs

echo "========================================" >> $LOG_FILE
echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始检查 BUGLIST..." >> $LOG_FILE

cd $WORKSPACE

TODO_COUNT=$(grep -c "^\- \[ \]" BUGLIST.md 2>/dev/null || echo "0")

echo "发现 $TODO_COUNT 个待处理任务" >> $LOG_FILE

if [ "$TODO_COUNT" -gt 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 有待修复的 bug，继续工作..." >> $LOG_FILE
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 所有 bug 已修复完成！✅" >> $LOG_FILE
fi

echo "" >> $LOG_FILE
