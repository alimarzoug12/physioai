import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin:      'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map userId → Set of socket IDs (user can have multiple tabs)
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private config:     ConfigService,
  ) {}

  // ── Connection ──────────────────────────────────────────────────
  async handleConnection(socket: Socket) {
    try {
      // Extract token from handshake
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });

      const userId = payload.userId;
      socket.data.userId = userId;

      // Register socket for this user
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Join a room named after the userId for easy targeting
      socket.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected (socket: ${socket.id})`);
      socket.emit('connected', { message: 'Connected to notification service' });

    } catch {
      this.logger.warn(`Unauthorized socket connection — disconnecting`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    if (userId) {
      this.userSockets.get(userId)?.delete(socket.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  // ── Send notification to a specific user ───────────────────────
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.log(`Notification sent to user ${userId}: ${event}`);
  }

  // ── Broadcast to all connected users ───────────────────────────
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // ── Client can mark notifications as read ─────────────────────
  @SubscribeMessage('mark_read')
  handleMarkRead(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    this.logger.log(`Mark read: ${data.notificationId} by ${socket.data.userId}`);
    // Acknowledge
    socket.emit('marked_read', { notificationId: data.notificationId });
  }
}