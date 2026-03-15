# 定时任务配置

## Bug 修复检查
- **频率**: 每 30 分钟
- **脚本**: `~/zodiac-empire/scripts/bugfix-scheduler.sh`
- **日志**: `~/zodiac-empire/logs/bugfix-scheduler.log`

## Crontab 配置
```bash
*/30 * * * * ~/zodiac-empire/scripts/bugfix-scheduler.sh
```

## 查看日志
```bash
tail -f ~/zodiac-empire/logs/bugfix-scheduler.log
```

## 管理定时任务
```bash
# 查看当前任务
crontab -l

# 编辑任务
crontab -e

# 删除所有任务
crontab -r
```

## 下次执行时间
- 当前时间：动态计算
- 下次检查：30 分钟后

## 任务内容
1. 检查 BUGLIST.md 中未完成的 bug 数量
2. 如果还有 bug，继续修复
3. 记录日志

---

**设置时间**: 2026-03-15 17:25
**设置者**: 小科 🔬
