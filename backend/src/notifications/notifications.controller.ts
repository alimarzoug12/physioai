import { Controller, Get, Patch, Param, Req, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Your existing endpoint — used by the Notifications page
  @Get()
  getAll(@Req() req: any) {
    return this.notificationsService.getPatientNotifications(req.user.userId);
  }

  // New endpoint — for the bell dropdown (persisted notifications)
  @Get('feed')
  getFeed(@Req() req: any, @Query('limit') limit?: string) {
    return this.notificationsService.getPersistedNotifications(
      req.user.userId,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }
}