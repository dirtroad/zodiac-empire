import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

// 日志目录
const logDir = path.join(process.cwd(), 'logs');

// 日志格式
const { combine, timestamp, printf } = winston.format;

// 自定义格式
const customFormat = printf(({ level, message, timestamp, context }) => {
  return `[${timestamp}] [${context || 'APP'}] ${level}: ${message}`;
});

// 开发环境配置
export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // 控制台输出
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        utilities.format.nestLike('ZodiacEmpire', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    
    // 错误日志文件
    new winston.transports.File({
      level: 'error',
      filename: path.join(logDir, 'error.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
      ),
    }),
    
    // 全部日志文件
    new winston.transports.File({
      level: 'info',
      filename: path.join(logDir, 'combined.log'),
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
      ),
    }),
  ],
});