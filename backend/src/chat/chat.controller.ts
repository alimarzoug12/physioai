import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // GET /chat/session — load history
  @Get('session')
  getSession(@Req() req: any) {
    return this.chatService.getSession(req.user.userId);
  }

  // POST /chat/message — send a message, get AI reply
  // ✅ CORRECT — handles both { content: "..." } and other shapes
  @Post('message')
  async sendMessage(
    @Req() req: any,
    @Body() body: { content?: string; message?: string },
  ) {
    const content = body.content || body.message || '';
    if (!content.trim()) {
      return { assistantMessage: { content: 'Please type a message.' } };
    }
    return this.chatService.sendMessage(req.user.userId, content.trim(), req.headers.authorization?.replace('Bearer ', '') ?? '',);
  }

  // DELETE /chat/session — clear history
  @Delete('session')
  clearSession(@Req() req: any) {
    return this.chatService.clearSession(req.user.userId);
  }
}