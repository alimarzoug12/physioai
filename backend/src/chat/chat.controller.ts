import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /chat/session — load history
  @Get('session')
  getSession(@Req() req: any) {
    return this.chatService.getSession(req.user.userId);
  }

  // POST /chat/message — send a message, get AI reply
  @Post('message')
  sendMessage(@Req() req: any, @Body('content') content: string) {
    return this.chatService.sendMessage(req.user.userId, content);
  }

  // DELETE /chat/session — clear history
  @Delete('session')
  clearSession(@Req() req: any) {
    return this.chatService.clearSession(req.user.userId);
  }
}