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
import { NotificationsService } from './notifications.service';  // ✅ AJOUTER CETTE LIGNE

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map userId → Set of socket IDs (user can have multiple tabs)
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private notificationsService: NotificationsService,  // ✅ AJOUTER CETTE LIGNE
  ) {
    // ✅ AJOUTER CETTE LIGNE — C'est le point clé !
    this.notificationsService.setGateway(this);
  }

  // ── Connection ──────────────────────────────────────────────────
  // async handleConnection(socket: Socket) {
  //   try {
  //     // Extract token from handshake
  //     const token =
  //       socket.handshake.auth?.token ||
  //       socket.handshake.headers?.authorization?.replace('Bearer ', '');

  //     if (!token) {
  //       this.logger.warn('No token provided — disconnecting');
  //       socket.disconnect();
  //       return;
  //     }

  //     // ✅ Vérifier que la clé secrète est bien récupérée
  //     const secret = this.config.get<string>('JWT_ACCESS_SECRET') ||
  //       this.config.get<string>('jwt.accessSecret');

  //     const payload = this.jwtService.verify(token, { secret });

  //     // ✅ Le champ userId peut être 'sub', 'userId' ou 'id'
  //     const userId = payload.sub || payload.userId || payload.id;

  //     if (!userId) {
  //       this.logger.warn('Invalid token — no userId found');
  //       socket.disconnect();
  //       return;
  //     }

  //     socket.data.userId = userId;

  //     // Register socket for this user
  //     if (!this.userSockets.has(userId)) {
  //       this.userSockets.set(userId, new Set());
  //     }
  //     this.userSockets.get(userId)!.add(socket.id);

  //     // Join a room named after the userId for easy targeting
  //     socket.join(`user:${userId}`);

  //     this.logger.log(`✅ User ${userId} connected (socket: ${socket.id})`);
  //     socket.emit('connected', { message: 'Connected to notification service' });

  //   } catch (error) {
  //     this.logger.warn(`Unauthorized socket connection — disconnecting: ${error.message}`);
  //     socket.disconnect();
  //   }
  // }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token
        || client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token || token === 'null' || token === 'undefined') {
        this.logger.warn('No token provided — disconnecting');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      client.data.userId = payload.userId;
      this.logger.log(`User ${payload.userId} connected (socket: ${client.id})`);

    } catch (err: any) {
      this.logger.warn(`Unauthorized socket connection — disconnecting: ${err.message}`);
      client.disconnect();
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
  //   sendToUser(userId: string, event: string, data: any) {
  //   // ✅ AJOUTER CES LOGS
  //   console.log(`📨📨📨 GATEWAY.sendToUser: userId=${userId}, event=${event}`);
  //   console.log(`📨📨📨 GATEWAY: rooms:`, this.server.sockets.adapter.rooms.keys());

  //   this.server.to(`user:${userId}`).emit(event, data);
  //   this.logger.log(`Notification sent to user ${userId}: ${event}`);
  // }

  // notifications/notifications.gateway.ts
  sendToUser(userId: string, event: string, data: any) {
    console.log(`📨📨📨 GATEWAY.sendToUser: userId=${userId}, event=${event}`);

    // ✅ AJOUTER CETTE VÉRIFICATION
    if (!this.server) {
      console.log(`❌❌❌ GATEWAY: server not initialized yet!`);
      return;
    }

    try {
      // ✅ VÉRIFIER QUE rooms EXISTE
      const rooms = this.server.sockets?.adapter?.rooms;
      if (rooms) {
        console.log(`📨📨📨 GATEWAY: rooms:`, rooms.keys());
      } else {
        console.log(`📨📨📨 GATEWAY: rooms not available yet`);
      }

      this.server.to(`user:${userId}`).emit(event, data);
      console.log(`✅ Notification sent to user ${userId}: ${event}`);
    } catch (error) {
      console.log(`❌❌❌ GATEWAY error:`, error.message);
    }
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
    socket.emit('marked_read', { notificationId: data.notificationId });
  }
}