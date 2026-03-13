import { Controller, Get, Post, Body, Query, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('聊天')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: '获取聊天房间列表' })
  async getRooms(@Request() req: any) {
    return this.chatService.getRooms(req.user.userId);
  }

  @Get('messages/:roomId')
  @ApiOperation({ summary: '获取房间消息' })
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('limit') limit: number,
    @Query('before') beforeId: number,
  ) {
    return this.chatService.getMessages(roomId, limit || 50, beforeId);
  }

  @Post('send')
  @ApiOperation({ summary: '发送消息' })
  async sendMessage(
    @Request() req: any,
    @Body('roomId') roomId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(req.user.userId, roomId, content);
  }
}