import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

// ── Conversation states ──────────────────────────────────────
type BookingState = 'IDLE' | 'AWAITING_DAY' | 'SHOWING_DOCTORS' | 'AWAITING_CONFIRMATION';

const DAY_MAP: Record<string, string> = {
  monday: 'Monday', lundi: 'Monday', 'الاثنين': 'Monday',
  tuesday: 'Tuesday', mardi: 'Tuesday', 'الثلاثاء': 'Tuesday', tuedsay: 'Tuesday', tuesdday: 'Tuesday', tusday: 'Tuesday',
  wednesday: 'Wednesday', mercredi: 'Wednesday', 'الأربعاء': 'Wednesday', wendesday: 'Wednesday',
  thursday: 'Thursday', jeudi: 'Thursday', 'الخميس': 'Thursday', thuseday: 'Thursday', thrusday: 'Thursday',
  friday: 'Friday', vendredi: 'Friday', 'الجمعة': 'Friday',
  saturday: 'Saturday', samedi: 'Saturday', 'السبت': 'Saturday',
  sunday: 'Sunday', dimanche: 'Sunday', 'الأحد': 'Sunday',
  tomorrow: 'Tomorrow', demain: 'Tomorrow', 'غداً': 'Tomorrow', 'غدا': 'Tomorrow',
  today: 'Today', "aujourd'hui": 'Today', 'اليوم': 'Today',
};

const BOOKING_KEYWORDS = [
  'book', 'reserve', 'appointment', 'schedule', 'session',
  'specialist', 'available', 'doctor', 'show me', 'name the',
  'can you show', 'see if', 'find me', 'choose',
  'حجز', 'احجز', 'موعد', 'متاح', 'طبيب', 'أطباء', 'أرني',
  'réserver', 'rendez-vous', 'séance', 'disponible', 'médecin',
];

const CONFIRM_WORDS = [
  'yes', 'confirm', 'ok', 'sure', 'go ahead', 'i confirm',
  'confirmed', 'do it', 'proceed', 'book it', 'please book',
  'نعم', 'أكد', 'تأكيد', 'موافق', 'تمام', 'حسناً', 'اوك',
  'oui', 'confirmer', 'je confirme', "d'accord", 'allons-y',
];

const REJECT_WORDS = ['no', 'cancel', 'لا', 'إلغاء', 'non', 'annuler'];

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly aiUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.aiUrl = this.config.get('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  // ── Get or create session ─────────────────────────────────────
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
    return this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  private detectDay(text: string): string | null {
    const lower = text.toLowerCase();
    const found = Object.keys(DAY_MAP).find(d => lower.includes(d));
    return found ? DAY_MAP[found] : null;
  }

  private isBookingIntent(text: string): boolean {
    const lower = text.toLowerCase();
    return BOOKING_KEYWORDS.some(kw => lower.includes(kw));
  }

  private isConfirming(text: string): boolean {
    const lower = text.toLowerCase().trim();
    return CONFIRM_WORDS.some(w => lower.includes(w.toLowerCase()));
  }

  private isRejecting(text: string): boolean {
    const lower = text.toLowerCase().trim();
    return REJECT_WORDS.some(w => lower.includes(w.toLowerCase()));
  }

  private detectLang(text: string): 'ar' | 'fr' | 'en' {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/\b(réserver|veux|voudrais|séance|oui|confirmer|jour|médecin)\b/i.test(text)) return 'fr';
    return 'en';
  }

  private async reply(sessionId: string, userMessage: any, content: string, extra: any = {}) {
    const assistantMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'ASSISTANT', content },
    });
    return {
      userMessage: {
        id: userMessage.id, role: userMessage.role,
        content: userMessage.content, createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id, role: assistantMessage.role,
        content: assistantMessage.content, createdAt: assistantMessage.createdAt,
      },
      extractedData: {},
      matchedDoctors: undefined,
      usedRAG: false,
      bookingCreated: false,
      ...extra,
    };
  }

  private async setState(sessionId: string, state: BookingState, extra: any = {}) {
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { bookingState: state, ...extra },
    });
  }

  // ── MAIN ENTRY POINT ─────────────────────────────────────────
  async sendMessage(userId: string, content: string) {
    const sessionId = await this.getOrCreateSession(userId);

    const session = await this.prisma.chatSession.findUnique({ where: { id: sessionId } });
    const state: BookingState = (session?.bookingState as BookingState) || 'IDLE';

    const recentMessages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const userMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'USER', content },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { healthProfile: true },
    });

    const history = recentMessages.map(m => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));

    const lowerContent = content.toLowerCase().trim();
    const day = this.detectDay(content);
    const wantsBooking = this.isBookingIntent(content);
    const confirming = this.isConfirming(content);
    const rejecting = this.isRejecting(content);
    const lang = this.detectLang(content);

    this.logger.log(
      `STATE=${state} | day=${day} | wantsBooking=${wantsBooking} | confirming=${confirming} | rejecting=${rejecting}`,
    );

    // ── FAQ detection — runs in IDLE state only (doesn't interrupt booking flow) ──
    const FAQ_KEYWORDS = [
      'price', 'cost', 'how much', 'fee',
      'where', 'location', 'address', 'clinic',
      'cancellation policy', 'refund policy',
      'insurance', 'cover',
      'how does', 'how do you', 'what is physioai',
      'كم', 'سعر', 'تكلفة', 'أين', 'مكان', 'تأمين',
      'combien', 'prix', 'où', 'assurance',
    ];

    const isFaqQuestion = state === 'IDLE' && FAQ_KEYWORDS.some(kw => lowerContent.includes(kw)) && !wantsBooking;

    if (isFaqQuestion) {
      try {
        const faqRes = await fetch(`${this.aiUrl}/faq`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
        });
        if (faqRes.ok) {
          const faqData = await faqRes.json();
          return this.reply(sessionId, userMessage, faqData.reply);
        }
      } catch (e) {
        this.logger.error('FAQ agent unreachable:', e.message);
      }
    }

    // ════════════════════════════════════════════════════════
    // STATE: AWAITING_CONFIRMATION — patient must say yes/no
    // ════════════════════════════════════════════════════════
    if (state === 'AWAITING_CONFIRMATION') {
      const doctorId = session?.pendingDoctorId;
      const slotId = session?.pendingSlotId;

      if (confirming && !rejecting && doctorId && slotId) {
        const doctor = await this.prisma.doctor.findUnique({
          where: { id: doctorId },
          include: { user: true, center: true },
        });
        const slot = await this.prisma.slot.findUnique({ where: { id: slotId } });

        if (doctor && slot) {
          const existingBooking = await this.prisma.booking.findFirst({ where: { slotId: slot.id, status: { not: 'CANCELLED' } } });

          if (!existingBooking) {
            await this.prisma.booking.create({
              data: {
                patientId: userId,
                doctorId: doctor.id,
                slotId: slot.id,
                status: 'PENDING',
                sessionType: 'CLINIC',
                notes: 'Booked via AI chat assistant',
                bookedVia: 'AI_AGENT',
              },
            });
            await this.prisma.slot.update({ where: { id: slot.id }, data: { isBooked: true } });
          }

          await this.setState(sessionId, 'IDLE', { pendingDay: null, pendingDoctorId: null, pendingSlotId: null });

          const dateStr = new Date(slot.date).toLocaleDateString(
            lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
            { weekday: 'long', month: 'long', day: 'numeric' },
          );

          const msg = lang === 'ar'
            ? `✅ تم إرسال طلب الحجز!\n\n📅 ${dateStr}\n🕐 ${slot.startTime}\n👨‍⚕️ د. ${doctor.user.fullName}\n🏥 ${doctor.center.name}\n\n⏳ في انتظار تأكيد الطبيب. ستتلقى بريداً إلكترونياً عند التأكيد.`
            : lang === 'fr'
              ? `✅ Demande envoyée!\n\n📅 ${dateStr}\n🕐 ${slot.startTime}\n👨‍⚕️ Dr. ${doctor.user.fullName}\n🏥 ${doctor.center.name}\n\n⏳ En attente du médecin. Vous recevrez un email dès confirmation.`
              : `✅ Booking request sent!\n\n📅 ${dateStr}\n🕐 ${slot.startTime}\n👨‍⚕️ Dr. ${doctor.user.fullName}\n🏥 ${doctor.center.name}\n\n⏳ Waiting for doctor confirmation. You will receive an email once confirmed.`;

          return this.reply(sessionId, userMessage, msg, { bookingCreated: true });
        }
      }

      if (rejecting) {
        await this.setState(sessionId, 'IDLE', { pendingDay: null, pendingDoctorId: null, pendingSlotId: null });
        const msg = lang === 'ar' ? 'حسناً، تم إلغاء طلب الحجز. كيف يمكنني مساعدتك؟'
          : lang === 'fr' ? 'Très bien, réservation annulée. Comment puis-je vous aider?'
            : 'Understood, booking cancelled. How else can I help you?';
        return this.reply(sessionId, userMessage, msg);
      }

      // Neither yes nor no — re-ask
      const msg = lang === 'ar' ? 'هل تؤكد هذا الحجز؟ (نعم / لا)'
        : lang === 'fr' ? 'Confirmez-vous cette réservation? (oui / non)'
          : 'Do you confirm this booking? (yes / no)';
      return this.reply(sessionId, userMessage, msg);
    }

    // ════════════════════════════════════════════════════════
    // Doctor selection — works in any state if doctor name + booking intent
    // ════════════════════════════════════════════════════════
    const doctorNameMatch =
      content.match(/dr\.?\s+([a-zA-Z\u0600-\u06FF]+)/i) ||
      content.match(/(?:choose|want|with)\s+(?:dr\.?\s+)?([a-zA-Z\u0600-\u06FF]{3,})/i);

    if ((state === 'SHOWING_DOCTORS' || wantsBooking) && doctorNameMatch) {
      const doctorName = doctorNameMatch[1];
      const doctor = await this.prisma.doctor.findFirst({
        where: { isAvailable: true, user: { fullName: { contains: doctorName, mode: 'insensitive' } } },
        include: {
          user: true, center: true,
          slots: { where: { isBooked: false, date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 5 },
        },
      });

      if (doctor && doctor.slots.length > 0) {
        const timeMatch = content.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
        const requestedTime = timeMatch?.[1]?.trim();
        const slot = requestedTime
          ? doctor.slots.find(s =>
            s.startTime.toLowerCase().replace(/\s/g, '').includes(requestedTime.toLowerCase().replace(/\s/g, '')),
          ) ?? doctor.slots[0]
          : doctor.slots[0];

        await this.setState(sessionId, 'AWAITING_CONFIRMATION', {
          pendingDoctorId: doctor.id,
          pendingSlotId: slot.id,
        });

        const dateStr = new Date(slot.date).toLocaleDateString(
          lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
          { weekday: 'long', month: 'long', day: 'numeric' },
        );

        const msg = lang === 'ar'
          ? `📋 تأكيد الحجز:\n\n👨‍⚕️ الدكتور: د. ${doctor.user.fullName}\n🏥 المركز: ${doctor.center.name}\n📅 التاريخ: ${dateStr}\n🕐 الوقت: ${slot.startTime}\n💰 السعر: ${doctor.pricePerSession} ريال\n\nهل تؤكد هذا الحجز؟ (نعم / لا)`
          : lang === 'fr'
            ? `📋 Confirmez votre réservation:\n\n👨‍⚕️ Dr. ${doctor.user.fullName}\n🏥 ${doctor.center.name}\n📅 ${dateStr}\n🕐 ${slot.startTime}\n💰 ${doctor.pricePerSession} QAR\n\nConfirmez-vous? (oui / non)`
            : `📋 Confirm your booking:\n\n👨‍⚕️ Doctor: Dr. ${doctor.user.fullName}\n🏥 Center: ${doctor.center.name}\n📅 Date: ${dateStr}\n🕐 Time: ${slot.startTime}\n💰 Price: ${doctor.pricePerSession} QAR\n\nDo you confirm this booking? (yes / no)`;

        return this.reply(sessionId, userMessage, msg);
      }
    }

    // ════════════════════════════════════════════════════════
    // Day mentioned → show doctors (works from ANY state)
    // ════════════════════════════════════════════════════════
    if (day || (wantsBooking && state === 'SHOWING_DOCTORS')) {
      const allText = [...recentMessages.map(m => m.content), content].join(' ');
      let specialty: string | null = null;

      try {
        const extractRes = await fetch(`${this.aiUrl}/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: allText }),
        });
        if (extractRes.ok) specialty = (await extractRes.json()).specialty;
      } catch {
        const t = allText.toLowerCase();
        if (t.includes('neck') || allText.includes('رقبة')) specialty = 'Musculoskeletal';
        else if (t.includes('back') || allText.includes('ظهر')) specialty = 'Musculoskeletal';
        else if (t.includes('knee') || allText.includes('ركبة')) specialty = 'Orthopedic';
        else if (t.includes('sport')) specialty = 'Sports Medicine';
      }

      const doctors = await this.prisma.doctor.findMany({
        where: { isAvailable: true },
        include: {
          user: true, center: true,
          slots: { where: { isBooked: false, date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 10 },
        },
        orderBy: { rating: 'desc' },
      });

      // ── Fuzzy specialty matching (handles "Musculoskeletal" matching "Musculoskeletal Specialist") ──
      let filteredDoctors = doctors;

      if (specialty) {
        const specLower = specialty.toLowerCase();

        const SPECIALTY_KEYWORDS: Record<string, string[]> = {
          'musculoskeletal': ['musculoskeletal', 'spine', 'manual therapy', 'orthopedic'],
          'sports medicine': ['sports', 'athletic', 'injury', 'rehabilitation'],
          'orthopedic': ['orthopedic', 'spine', 'acupuncture'],
          'neurological': ['neurological', 'post-surgery', 'pain management'],
          'pediatric': ['pediatric'],
          'pain management': ['pain management', 'post-surgery'],
          'rehabilitation': ['rehabilitation', 'sports rehab', 'injury prevention'],
        };

        const keywords = SPECIALTY_KEYWORDS[specLower] || [specLower];

        filteredDoctors = doctors.filter(d =>
          d.specialties.some(s => keywords.some(kw => s.toLowerCase().includes(kw))),
        );

        if (filteredDoctors.length === 0) {
          this.logger.warn(`No fuzzy match for "${specialty}" — showing all available doctors`);
          filteredDoctors = doctors;
        }
      }

      const matchedDoctorsRaw = filteredDoctors.slice(0, 3);

      this.logger.log(`🔍 specialty searched: "${specialty}"`);
      this.logger.log(`🔍 doctors found after fuzzy match: ${matchedDoctorsRaw.length}`);

      const matchedDoctors = matchedDoctorsRaw.map(d => {
        let relevantSlots = d.slots;
        if (day && day !== 'Today' && day !== 'Tomorrow' && day !== 'Next Week') {
          relevantSlots = d.slots.filter(s => {
            const slotDayName = new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' });
            return slotDayName === day;
          });
        }

        return {
          id: d.id,
          name: d.user.fullName,
          specialty: d.specialties[0] ?? 'General Physiotherapy',
          specialties: d.specialties,
          rating: d.rating ?? 0,
          price: d.pricePerSession ?? 0,
          center: d.center?.name ?? '',
          centerAddress: d.center?.address ?? '',
          centerCity: d.center?.city ?? 'Doha',
          languages: d.languages ?? [],
          bio: d.bio ?? '',
          isAvailable: d.isAvailable,
          avatarUrl: d.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
          availableSlots: (relevantSlots.length > 0 ? relevantSlots : d.slots.slice(0, 3)).map(s => ({
            id: s.id, date: s.date, startTime: s.startTime, endTime: s.endTime,
          })),
          hasAvailableSlots: relevantSlots.length > 0,
        };
      });

      await this.setState(sessionId, 'SHOWING_DOCTORS', { pendingDay: day });

      const msg = lang === 'ar'
        ? `إليك الأطباء المتاحون${day ? ' يوم ' + day : ''}. اختر الطبيب المناسب من القائمة أدناه.`
        : lang === 'fr'
          ? `Voici les spécialistes disponibles${day ? ' ' + day : ''}. Choisissez le médecin qui vous convient ci-dessous.`
          : `Here are the available specialists${day ? ' for ' + day : ''}. Please choose one below to continue with your booking.`;

      const assistantMessage = await this.prisma.chatMessage.create({
        data: { sessionId, role: 'ASSISTANT', content: msg },
      });

      this.logger.log(`Matched ${matchedDoctors.length} doctors (specialty: ${specialty})`);

      return {
        userMessage: { id: userMessage.id, role: userMessage.role, content: userMessage.content, createdAt: userMessage.createdAt },
        assistantMessage: { id: assistantMessage.id, role: assistantMessage.role, content: assistantMessage.content, createdAt: assistantMessage.createdAt },
        extractedData: {},
        matchedDoctors: matchedDoctors.length > 0 ? matchedDoctors : undefined,
        usedRAG: false,
        bookingCreated: false,
      };
    }

    // ════════════════════════════════════════════════════════
    // Booking intent but no day → ask ONCE, set state
    // ════════════════════════════════════════════════════════
    if (wantsBooking && state !== 'AWAITING_DAY') {
      await this.setState(sessionId, 'AWAITING_DAY');

      const msg = lang === 'ar' ? 'بكل سرور! أي يوم يناسبك للحجز؟'
        : lang === 'fr' ? 'Avec plaisir! Quel jour vous convient pour la réservation?'
          : "I'd be happy to help you book! Which day works for you?";

      return this.reply(sessionId, userMessage, msg);
    }

    // If in AWAITING_DAY and STILL no day detected — re-ask politely (max loop guard)
    if (state === 'AWAITING_DAY' && !day) {
      const msg = lang === 'ar' ? 'عذراً، لم أفهم اليوم. هل يمكنك ذكر يوم محدد مثل الثلاثاء أو الجمعة؟'
        : lang === 'fr' ? "Je n'ai pas compris le jour. Pouvez-vous préciser, par exemple mardi ou vendredi?"
          : "I didn't catch the day. Could you specify a day like Tuesday or Friday?";
      return this.reply(sessionId, userMessage, msg);
    }

    // ════════════════════════════════════════════════════════
    // DEFAULT: Regular AI medical chat (no booking flow involved)
    // ════════════════════════════════════════════════════════
    await this.setState(sessionId, 'IDLE');

    let aiReply = "I'm sorry, the AI service is temporarily unavailable. Please try again.";
    let usedRAG = false;

    try {
      const response = await fetch(`${this.aiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history,
          showDoctors: false,
          userProfile: user?.healthProfile ? {
            age: user.healthProfile.age,
            gender: user.healthProfile.gender,
            backPain: user.healthProfile.backPain,
            jointPain: user.healthProfile.jointPain,
            sportsInjury: user.healthProfile.sportsInjury,
            neckIssues: user.healthProfile.neckIssues,
            activityLevel: user.healthProfile.activityLevel,
          } : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        aiReply = data.reply || 'I could not generate a response.';
        usedRAG = data.usedRAG ?? false;
        if (typeof aiReply !== 'string' || !aiReply.trim()) {
          aiReply = 'I could not generate a response. Please try again.';
        }
      } else {
        this.logger.error(`AI service returned ${response.status}`);
      }
    } catch (err: any) {
      this.logger.error('AI service unreachable:', err.message);
    }

    const assistantMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'ASSISTANT', content: aiReply },
    });

    if (recentMessages.length === 0) {
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { title: content.length > 50 ? content.slice(0, 47) + '...' : content },
      });
    }

    return {
      userMessage: { id: userMessage.id, role: userMessage.role, content: userMessage.content, createdAt: userMessage.createdAt },
      assistantMessage: { id: assistantMessage.id, role: assistantMessage.role, content: assistantMessage.content, createdAt: assistantMessage.createdAt },
      extractedData: {},
      matchedDoctors: undefined,
      usedRAG,
      bookingCreated: false,
    };
  }

  // ── Clear session ─────────────────────────────────────────────
  async clearSession(userId: string) {
    const sessionId = await this.getOrCreateSession(userId);
    await this.prisma.chatMessage.deleteMany({ where: { sessionId } });
    await this.setState(sessionId, 'IDLE', { pendingDay: null, pendingDoctorId: null, pendingSlotId: null });
    return { cleared: true };
  }
}