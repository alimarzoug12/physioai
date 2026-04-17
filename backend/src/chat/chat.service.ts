import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Get or create the active session for the user
  async getOrCreateSession(userId: string): Promise<string> {
    const existing = await this.prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    if (existing) return existing.id;

    const session = await this.prisma.chatSession.create({
      data: { userId, title: 'Symptom Assessment' },
    });
    return session.id;
  }

  async getSession(userId: string) {
    const sessionId = await this.getOrCreateSession(userId);
    const session = await this.prisma.chatSession.findUnique({
      where:   { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    return session;
  }

  async sendMessage(userId: string, content: string) {
    const sessionId = await this.getOrCreateSession(userId);

    // Save user message
    const userMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'USER', content },
    });

    // Update session timestamp
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data:  { updatedAt: new Date() },
    });

    // AI placeholder — replace with RAG/LangChain later
    const aiReply = 'Coming soon — AI analysis powered by RAG and LangChain is on its way!';

    const assistantMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'ASSISTANT', content: aiReply },
    });

    return {
      userMessage: {
        id:        userMessage.id,
        role:      userMessage.role,
        content:   userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id:        assistantMessage.id,
        role:      assistantMessage.role,
        content:   assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
    };
  }

  async clearSession(userId: string) {
    const sessionId = await this.getOrCreateSession(userId);
    await this.prisma.chatMessage.deleteMany({ where: { sessionId } });
    return { cleared: true };
  }
}