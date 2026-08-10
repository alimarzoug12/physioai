import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface BookingConfirmationData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'Clinic Visit' | 'Home Visit';
  centerName: string;
  centerAddress: string;
  duration: number;
  totalAmount: number;
  currency: string;
  bookingId: string;
}

export interface SessionReminderData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'Clinic Visit' | 'Home Visit';
  centerName: string;
  centerAddress: string;
  bookingId: string;
}

export interface BookingCancelledData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  sessionDate: string;
  sessionTime: string;
  refundAmount: number;
  refundPercent: number;
  currency: string;
  bookingId: string;
}

export interface BookingRescheduledData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  sessionType: 'Clinic Visit' | 'Home Visit';
  centerName: string;
  bookingId: string;
}

export interface VerificationEmailData {
  userName: string;
  userEmail: string;
  verificationCode: string;
}

export interface PasswordResetData {
  userName: string;
  userEmail: string;
  resetLink: string;
}
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private config: ConfigService) {
    console.log('📧 MAIL_HOST:', this.config.get<string>('MAIL_HOST'));
  console.log('📧 MAIL_USER:', this.config.get<string>('MAIL_USER'));
  console.log('📧 MAIL_PASS:', this.config.get<string>('MAIL_PASS') ? '✅ Défini' : '❌ Manquant');
    this.from = this.config.get<string>('mail.from') || 'PhysioAI <noreply@physioai.com>';
    this.frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      secure: this.config.get<number>('mail.port') === 465,
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.pass'),
      },
    });

    // Verify connection on startup
    this.transporter.verify()
      .then(() => this.logger.log('✅ Mail service connected'))
      .catch(err => this.logger.warn(`⚠️ Mail service not connected: ${err.message}`));
  }

  // async sendVerificationEmail(to: string, fullName: string, token: string) {
  //   const appUrl = this.config.get('app.url');
  //   const link = `${appUrl}/verify-email?token=${token}`;

  //   await this.send(to, 'Verify your PhysioAI account', `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //       <h2 style="color: #06b6d4;">Welcome to PhysioAI, ${fullName}!</h2>
  //       <p>Please verify your email address to activate your account.</p>
  //       <a href="${link}"
  //          style="display:inline-block; background:#3b82f6; color:white;
  //                 padding:12px 24px; border-radius:8px; text-decoration:none;
  //                 font-weight:bold; margin:16px 0;">
  //         Verify Email Address
  //       </a>
  //       <p style="color:#6b7280; font-size:14px;">
  //         This link expires in 24 hours.<br/>
  //         If you did not create an account, ignore this email.
  //       </p>
  //       <p style="color:#6b7280; font-size:12px;">
  //         Or copy this link: ${link}
  //       </p>
  //     </div>
  //   `);
  // }

  async sendPasswordResetEmail(to: string, fullName: string, token: string) {
    const appUrl = this.config.get('app.url');
    const link = `${appUrl}/reset-password?token=${token}`;

    await this.send(to, 'Reset your PhysioAI password', `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Password Reset Request</h2>
        <p>Hi ${fullName}, we received a request to reset your password.</p>
        <a href="${link}"
           style="display:inline-block; background:#ef4444; color:white;
                  padding:12px 24px; border-radius:8px; text-decoration:none;
                  font-weight:bold; margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#6b7280; font-size:14px;">
          This link expires in 1 hour.<br/>
          If you did not request this, ignore this email — your password will not change.
        </p>
        <p style="color:#6b7280; font-size:12px;">
          Or copy this link: ${link}
        </p>
      </div>
    `);
  }

  // async sendBookingConfirmation(
  //   to: string, fullName: string,
  //   doctorName: string, date: string, time: string,
  // ) {
  //   await this.send(to, 'Booking Confirmed — PhysioAI', `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  //       <h2 style="color: #06b6d4;">Booking Confirmed ✓</h2>
  //       <p>Hi ${fullName}, your session has been confirmed.</p>
  //       <div style="background:#f0f9ff; border-radius:8px; padding:16px; margin:16px 0;">
  //         <p><strong>Doctor:</strong> ${doctorName}</p>
  //         <p><strong>Date:</strong> ${date}</p>
  //         <p><strong>Time:</strong> ${time}</p>
  //       </div>
  //       <p style="color:#6b7280; font-size:14px;">
  //         You can manage your bookings in the PhysioAI app.
  //       </p>
  //     </div>
  //   `);
  // }

  // private async send(to: string, subject: string, html: string) {
  //   // In dev with no mail config, just log instead of crashing
  //   if (!this.config.get('mail.user') || this.config.get('mail.user') === 'your@gmail.com') {
  //     this.logger.warn(`[DEV] Email not sent (no mail config). Would send to: ${to}`);
  //     this.logger.warn(`[DEV] Subject: ${subject}`);
  //     return;
  //   }

  //   try {
  //     await this.transporter.sendMail({
  //       from: this.config.get('mail.from'),
  //       to,
  //       subject,
  //       html,
  //     });
  //     this.logger.log(`Email sent to ${to}: ${subject}`);
  //   } catch (err) {
  //     this.logger.error(`Failed to send email to ${to}:`, err);
  //     // Don't throw — email failure should never break an API response
  //   }
  // }

  // ── Core send method ──────────────────────────────────────────
  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to} — ${info.messageId}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      // Never throw — email failure should not break the booking flow
    }
  }

  // ── Shared CSS styles for all emails ─────────────────────────
  private getBaseStyles(): string {
    return `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
               background: #f4f6f9; color: #333; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
        .card { background: #ffffff; border-radius: 16px;
                overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
                  padding: 32px 32px 24px; text-align: center; }
        .header-logo { font-size: 28px; font-weight: 700; color: #ffffff;
                        letter-spacing: -0.5px; margin-bottom: 4px; }
        .header-tag { color: rgba(255,255,255,0.8); font-size: 14px; }
        .body { padding: 32px; }
        .greeting { font-size: 22px; font-weight: 600; color: #1e293b;
                    margin-bottom: 8px; }
        .subtitle { color: #64748b; font-size: 15px; margin-bottom: 28px; }
        .detail-card { background: #f8fafc; border-radius: 12px;
                        border: 1px solid #e2e8f0; padding: 20px;
                        margin-bottom: 20px; }
        .detail-title { font-size: 13px; font-weight: 600; color: #94a3b8;
                         text-transform: uppercase; letter-spacing: 0.5px;
                         margin-bottom: 14px; }
        .detail-row { display: flex; justify-content: space-between;
                       align-items: center; padding: 8px 0;
                       border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #64748b; font-size: 14px; }
        .detail-value { color: #1e293b; font-size: 14px; font-weight: 500; }
        .badge { display: inline-block; padding: 4px 12px;
                  border-radius: 20px; font-size: 13px; font-weight: 500; }
        .badge-green  { background: #dcfce7; color: #15803d; }
        .badge-blue   { background: #dbeafe; color: #1d4ed8; }
        .badge-orange { background: #fed7aa; color: #c2410c; }
        .badge-red    { background: #fee2e2; color: #b91c1c; }
        .btn { display: inline-block; padding: 14px 32px;
                background: linear-gradient(135deg, #3b82f6, #06b6d4);
                color: #ffffff; text-decoration: none; border-radius: 10px;
                font-weight: 600; font-size: 15px; margin: 8px 0; }
        .amount { font-size: 28px; font-weight: 700; color: #3b82f6; }
        .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
        .footer { text-align: center; padding: 24px 32px;
                   background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .footer p { color: #94a3b8; font-size: 13px; line-height: 1.6; }
        .footer a { color: #3b82f6; text-decoration: none; }
        .icon { font-size: 40px; margin-bottom: 12px; display: block; }
        .alert { border-radius: 10px; padding: 14px 18px;
                  margin-bottom: 20px; font-size: 14px; }
        .alert-blue   { background: #eff6ff; border-left: 4px solid #3b82f6;
                          color: #1e40af; }
        .alert-yellow { background: #fffbeb; border-left: 4px solid #f59e0b;
                          color: #92400e; }
        .alert-green  { background: #f0fdf4; border-left: 4px solid #22c55e;
                          color: #15803d; }
      </style>
    `;
  }

  private getFooter(): string {
    return `
      <div class="footer">
        <p>
          This email was sent by <strong>PhysioAI</strong><br>
          Qatar's leading physiotherapy booking platform<br><br>
          <a href="${this.frontendUrl}">Visit PhysioAI</a> ·
          <a href="${this.frontendUrl}/sessions">My Sessions</a> ·
          <a href="${this.frontendUrl}/settings">Manage Notifications</a>
        </p>
      </div>
    `;
  }

  // ────────────────────────────────────────────────────────────────
  // 1. BOOKING CONFIRMATION EMAIL
  // ────────────────────────────────────────────────────────────────
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
    const sessionIcon = data.sessionType === 'Home Visit' ? '🏠' : '🏥';

    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Booking Confirmation</div>
            </div>

            <div class="body">
              <span class="icon">✅</span>
              <div class="greeting">Your session is confirmed!</div>
              <div class="subtitle">
                Hi ${data.patientName}, your physiotherapy session has been
                successfully booked. See the details below.
              </div>

              <div class="detail-card">
                <div class="detail-title">📋 Session Details</div>
                <div class="detail-row">
                  <span class="detail-label">Doctor</span>
                  <span class="detail-value">Dr. ${data.doctorName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Specialty</span>
                  <span class="detail-value">${data.specialty}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.sessionDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${data.sessionTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">${data.duration} minutes</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type</span>
                  <span class="detail-value">
                    <span class="badge badge-blue">
                      ${sessionIcon} ${data.sessionType}
                    </span>
                  </span>
                </div>
                ${data.sessionType === 'Clinic Visit' ? `
                <div class="detail-row">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">${data.centerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">${data.centerAddress}</span>
                </div>
                ` : `
                <div class="detail-row">
                  <span class="detail-label">Type</span>
                  <span class="detail-value">Doctor will come to your location</span>
                </div>
                `}
              </div>

              <div class="detail-card">
                <div class="detail-title">💳 Payment Summary</div>
                <div class="detail-row">
                  <span class="detail-label">Total Paid</span>
                  <span class="detail-value amount">
                    ${data.totalAmount} ${data.currency}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking ID</span>
                  <span class="detail-value" style="font-family: monospace; font-size:12px;">
                    #${data.bookingId.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">
                    <span class="badge badge-green">✓ Confirmed</span>
                  </span>
                </div>
              </div>

              <div class="alert alert-yellow">
                ⏰ <strong>Cancellation policy:</strong>
                Free cancellation up to 24 hours before your session.
                50% refund for cancellations 6–24 hours before.
                No refund within 6 hours.
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${this.frontendUrl}/sessions" class="btn">
                  View My Sessions
                </a>
              </div>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.patientEmail,
      `✅ Booking Confirmed — Dr. ${data.doctorName} on ${data.sessionDate}`,
      html,
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 2. SESSION REMINDER EMAIL (24h before)
  // ────────────────────────────────────────────────────────────────
  async sendSessionReminder(data: SessionReminderData): Promise<void> {
    const sessionIcon = data.sessionType === 'Home Visit' ? '🏠' : '🏥';

    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Session Reminder</div>
            </div>

            <div class="body">
              <span class="icon">⏰</span>
              <div class="greeting">Your session is tomorrow!</div>
              <div class="subtitle">
                Hi ${data.patientName}, this is a friendly reminder about your
                physiotherapy session tomorrow with Dr. ${data.doctorName}.
              </div>

              <div class="detail-card">
                <div class="detail-title">📅 Tomorrow's Session</div>
                <div class="detail-row">
                  <span class="detail-label">Doctor</span>
                  <span class="detail-value">Dr. ${data.doctorName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Specialty</span>
                  <span class="detail-value">${data.specialty}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.sessionDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value" style="font-size:18px; font-weight:700; color:#3b82f6;">
                    ${data.sessionTime}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type</span>
                  <span class="detail-value">
                    <span class="badge badge-blue">
                      ${sessionIcon} ${data.sessionType}
                    </span>
                  </span>
                </div>
                ${data.sessionType === 'Clinic Visit' ? `
                <div class="detail-row">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">${data.centerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">${data.centerAddress}</span>
                </div>
                ` : ''}
              </div>

              <div class="alert alert-blue">
                💡 <strong>Preparation tips:</strong>
                Wear comfortable clothing. Bring any previous medical reports or X-rays.
                Arrive 5–10 minutes early if visiting the clinic.
                Stay hydrated before your session.
              </div>

              <div class="alert alert-yellow">
                ⚠️ Need to reschedule? You still have time.
                Cancellations made now (24h+ before) are eligible for a full refund.
              </div>

              <div style="text-align: center; margin: 28px 0 16px;">
                <a href="${this.frontendUrl}/sessions" class="btn">
                  View Session Details
                </a>
              </div>
              <div style="text-align: center;">
                <a href="${this.frontendUrl}/sessions"
                   style="color: #ef4444; font-size: 14px; text-decoration: none;">
                  Need to cancel or reschedule?
                </a>
              </div>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.patientEmail,
      `⏰ Reminder: Session with Dr. ${data.doctorName} tomorrow at ${data.sessionTime}`,
      html,
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 3. BOOKING CANCELLED EMAIL
  // ────────────────────────────────────────────────────────────────
  async sendBookingCancelled(data: BookingCancelledData): Promise<void> {
    const refundSection = data.refundAmount > 0 ? `
      <div class="detail-card">
        <div class="detail-title">💰 Refund Information</div>
        <div class="detail-row">
          <span class="detail-label">Refund Amount</span>
          <span class="detail-value amount">
            ${data.refundAmount} ${data.currency}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Refund Rate</span>
          <span class="detail-value">
            <span class="badge badge-green">${data.refundPercent}% refund</span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Refund Method</span>
          <span class="detail-value">PhysioAI Wallet (instant)</span>
        </div>
      </div>
      <div class="alert alert-green">
        ✅ Your refund of ${data.refundAmount} ${data.currency} has been
        added to your PhysioAI wallet immediately.
        You can use it for your next booking.
      </div>
    ` : `
      <div class="alert alert-orange" style="background:#fff7ed; border-left: 4px solid #f97316; color:#9a3412; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
        ℹ️ No refund applies as the session was cancelled within 6 hours.
        Please refer to our cancellation policy for details.
      </div>
    `;

    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header" style="background: linear-gradient(135deg, #ef4444, #f97316);">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Booking Cancelled</div>
            </div>

            <div class="body">
              <span class="icon">❌</span>
              <div class="greeting">Your booking has been cancelled</div>
              <div class="subtitle">
                Hi ${data.patientName}, your session has been successfully cancelled.
              </div>

              <div class="detail-card">
                <div class="detail-title">📋 Cancelled Session</div>
                <div class="detail-row">
                  <span class="detail-label">Doctor</span>
                  <span class="detail-value">Dr. ${data.doctorName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.sessionDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${data.sessionTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">
                    <span class="badge badge-red">Cancelled</span>
                  </span>
                </div>
              </div>

              ${refundSection}

              <div style="text-align: center; margin: 28px 0;">
                <a href="${this.frontendUrl}/book" class="btn">
                  Book a New Session
                </a>
              </div>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.patientEmail,
      `❌ Booking Cancelled — Session with Dr. ${data.doctorName}`,
      html,
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 4. BOOKING RESCHEDULED EMAIL
  // ────────────────────────────────────────────────────────────────
  async sendBookingRescheduled(data: BookingRescheduledData): Promise<void> {
    const sessionIcon = data.sessionType === 'Home Visit' ? '🏠' : '🏥';

    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header" style="background: linear-gradient(135deg, #8b5cf6, #3b82f6);">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Booking Rescheduled</div>
            </div>

            <div class="body">
              <span class="icon">📅</span>
              <div class="greeting">Your session has been rescheduled</div>
              <div class="subtitle">
                Hi ${data.patientName}, your session with Dr. ${data.doctorName}
                has been moved to a new date and time.
              </div>

              <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                <div class="detail-card" style="flex:1; opacity:0.6;">
                  <div class="detail-title">❌ Old Schedule</div>
                  <div style="font-weight:600; color:#64748b; margin-bottom:4px;">
                    ${data.oldDate}
                  </div>
                  <div style="color:#94a3b8;">${data.oldTime}</div>
                </div>
                <div style="display:flex; align-items:center; font-size:24px; padding:0 8px;">
                  →
                </div>
                <div class="detail-card" style="flex:1; border-color:#3b82f6;">
                  <div class="detail-title" style="color:#3b82f6;">✅ New Schedule</div>
                  <div style="font-weight:700; color:#1e293b; font-size:16px; margin-bottom:4px;">
                    ${data.newDate}
                  </div>
                  <div style="color:#3b82f6; font-weight:600;">${data.newTime}</div>
                </div>
              </div>

              <div class="detail-card">
                <div class="detail-title">📋 Session Details</div>
                <div class="detail-row">
                  <span class="detail-label">Doctor</span>
                  <span class="detail-value">Dr. ${data.doctorName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Specialty</span>
                  <span class="detail-value">${data.specialty}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type</span>
                  <span class="detail-value">
                    <span class="badge badge-blue">
                      ${sessionIcon} ${data.sessionType}
                    </span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">${data.centerName}</span>
                </div>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${this.frontendUrl}/sessions" class="btn">
                  View Updated Session
                </a>
              </div>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.patientEmail,
      `📅 Session Rescheduled — Dr. ${data.doctorName} now on ${data.newDate}`,
      html,
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 5. EMAIL VERIFICATION (already existed, improved template)
  // ────────────────────────────────────────────────────────────────
  async sendVerificationEmail(data: VerificationEmailData): Promise<void> {
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Email Verification</div>
            </div>

            <div class="body">
              <span class="icon">📧</span>
              <div class="greeting">Verify your email address</div>
              <div class="subtitle">
                Hi ${data.userName}, welcome to PhysioAI!
                Use the code below to verify your email address.
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <div style="display: inline-block; background: #f0f9ff;
                             border: 2px dashed #3b82f6; border-radius: 16px;
                             padding: 24px 48px;">
                  <div style="font-size: 13px; color: #64748b;
                               margin-bottom: 8px; letter-spacing: 0.5px;">
                    YOUR VERIFICATION CODE
                  </div>
                  <div style="font-size: 48px; font-weight: 800;
                               color: #3b82f6; letter-spacing: 12px;">
                    ${data.verificationCode}
                  </div>
                </div>
              </div>

              <div class="alert alert-yellow">
                ⚠️ This code expires in <strong>10 minutes</strong>.
                Do not share it with anyone.
              </div>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.userEmail,
      `${data.verificationCode} is your PhysioAI verification code`,
      html,
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 6. PASSWORD RESET EMAIL
  // ────────────────────────────────────────────────────────────────
  async sendPasswordReset(data: PasswordResetData): Promise<void> {
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        ${this.getBaseStyles()}
      </head><body>
        <div class="wrapper">
          <div class="card">

            <div class="header">
              <div class="header-logo">🏥 PhysioAI</div>
              <div class="header-tag">Password Reset</div>
            </div>

            <div class="body">
              <span class="icon">🔐</span>
              <div class="greeting">Reset your password</div>
              <div class="subtitle">
                Hi ${data.userName}, we received a request to reset your password.
                Click the button below to create a new password.
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.resetLink}" class="btn">
                  Reset My Password
                </a>
              </div>

              <div class="alert alert-yellow">
                ⚠️ This link expires in <strong>1 hour</strong>.
                If you did not request a password reset, you can safely ignore this email.
              </div>

              <div class="divider"></div>
              <p style="font-size: 13px; color: #94a3b8; text-align: center;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${data.resetLink}" style="color:#3b82f6; word-break:break-all;">
                  ${data.resetLink}
                </a>
              </p>
            </div>

            ${this.getFooter()}
          </div>
        </div>
      </body></html>
    `;

    await this.send(
      data.userEmail,
      '🔐 Reset your PhysioAI password',
      html,
    );
  }
  async sendBookingRequestToDoctor(data: {
    to: string;
    doctorName: string;
    patientName: string;
    date: string;
    time: string;
    sessionType: string;
    bookingId: string;
  }) {
    await this.transporter.sendMail({
      from: this.from,
      to: data.to,
      subject: `New Session Request — ${data.patientName}`,
      html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">New Booking Request</h2>
        <p>Hello Dr. ${data.doctorName},</p>
        <p><strong>${data.patientName}</strong> has requested a session with you.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;background:#f3f4f6"><strong>Date</strong></td><td style="padding:8px">${data.date}</td></tr>
          <tr><td style="padding:8px;background:#f3f4f6"><strong>Time</strong></td><td style="padding:8px">${data.time}</td></tr>
          <tr><td style="padding:8px;background:#f3f4f6"><strong>Type</strong></td><td style="padding:8px">${data.sessionType}</td></tr>
        </table>
        <p>Please log in to your dashboard to confirm or decline this request.</p>
        <a href="${process.env.FRONTEND_URL}/provider-dashboard" 
           style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
          View Request
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">PhysioAI — Qatar</p>
      </div>
    `,
    });
  }
}