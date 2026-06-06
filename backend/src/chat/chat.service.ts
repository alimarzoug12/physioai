import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

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

  // ── Get session with messages ─────────────────────────────────
  async getSession(userId: string) {
    const sessionId = await this.getOrCreateSession(userId);
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    return session;
  }

  // ── Send message — calls Python AI service ────────────────────
  async sendMessage(userId: string, content: string) {
    const sessionId = await this.getOrCreateSession(userId);

    // 1. Load recent history for context
    const recentMessages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // 2. Save user message immediately
    const userMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'USER', content },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    // 3. Get user health profile for personalization
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { healthProfile: true },
    });

    // 4. Build conversation history for Python service
    const history = recentMessages.map(m => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));

    // ── Detect confirmation words in any language ─────────────
    const confirmationWords = [
      // English
      'yes', 'confirm', 'ok', 'sure', 'book it', 'go ahead',
      'please book', 'i confirm', 'confirmed', 'do it', 'proceed',
      // Arabic
      'نعم', 'أكد', 'تأكيد', 'موافق', 'حجز', 'احجز', 'اريد الحجز',
      'نعم احجز', 'تمام', 'حسناً', 'اوك', 'موافقة', 'نعم أريد',
      // French
      'oui', 'confirmer', 'je confirme', 'd\'accord', 'allons-y',
    ];

    const isConfirming = confirmationWords.some(word =>
      content.toLowerCase().trim().includes(word.toLowerCase())
    );

    // Check last 3 AI messages for booking suggestion
    const lastAiMessages = [...recentMessages]
      .reverse()
      .filter(m => m.role === 'ASSISTANT')
      .slice(0, 3);

    const bookingKeywords = [
      'book', 'appointment', 'schedule', 'confirm', 'session',
      'حجز', 'موعد', 'جلسة', 'تأكيد', 'احجز',
      'réserver', 'rendez-vous', 'séance',
    ];

    const aiSuggestedBooking = lastAiMessages.some(msg =>
      bookingKeywords.some(kw =>
        msg.content.toLowerCase().includes(kw.toLowerCase())
      )
    );

    this.logger.log(`isConfirming: ${isConfirming}, aiSuggestedBooking: ${aiSuggestedBooking}, content: "${content}"`);

    // ── If user confirms → find available doctor and book ─────
    //     if (isConfirming && aiSuggestedBooking) {
    //       // Find available doctor from DB
    //       const availableDoctor = await this.prisma.doctor.findFirst({
    //         where: { isAvailable: true },
    //         include: {
    //           user: true,
    //           center: true,
    //           slots: {
    //             where: {
    //               isBooked: false,
    //               date: { gte: new Date() },
    //             },
    //             orderBy: { date: 'asc' },
    //             take: 1,
    //           },
    //         },
    //         orderBy: { rating: 'desc' },
    //       });

    //       if (availableDoctor && availableDoctor.slots.length > 0) {
    //         const slot = availableDoctor.slots[0];

    //         // Create the booking
    //         await this.prisma.booking.create({
    //           data: {
    //             patientId: userId,
    //             doctorId: availableDoctor.id,
    //             slotId: slot.id,
    //             status: 'CONFIRMED',
    //             sessionType: 'CLINIC',
    //             notes: 'Booked via AI chat',
    //             bookedVia: 'AI_AGENT',
    //           },
    //         });

    //         // Mark slot as booked
    //         await this.prisma.slot.update({
    //           where: { id: slot.id },
    //           data: { isBooked: true },
    //         });

    //         this.logger.log(`✅ AI booked session for patient ${userId}`);

    //         const confirmReply = `✅ Done! Your appointment is confirmed:
    // 📅 Date: ${new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
    // 🕐 Time: ${slot.startTime}
    // 👨‍⚕️ Doctor: Dr. ${availableDoctor.user.fullName}
    // 🏥 Center: ${availableDoctor.center.name}

    // You can view it in your Sessions page.`;

    //         const assistantMessage = await this.prisma.chatMessage.create({
    //           data: { sessionId, role: 'ASSISTANT', content: confirmReply },
    //         });

    //         return {
    //           userMessage: {
    //             id: userMessage.id,
    //             role: userMessage.role,
    //             content: userMessage.content,
    //             createdAt: userMessage.createdAt,
    //           },
    //           assistantMessage: {
    //             id: assistantMessage.id,
    //             role: assistantMessage.role,
    //             content: assistantMessage.content,
    //             createdAt: assistantMessage.createdAt,
    //           },
    //           extractedData: {},
    //           matchedDoctors: undefined,
    //           usedRAG: false,
    //           bookingCreated: true,
    //         };
    //       }
    //     }
    if (isConfirming && aiSuggestedBooking) {
      this.logger.log('✅ User confirmed booking — searching for available doctor...');

      // Find ANY available doctor with a future slot
      const availableDoctor = await this.prisma.doctor.findFirst({
        where: { isAvailable: true },
        include: {
          user: true,
          center: true,
          slots: {
            where: {
              isBooked: false,
              date: { gte: new Date() },
            },
            orderBy: { date: 'asc' },
            take: 1,
          },
        },
        orderBy: { rating: 'desc' },
      });

      this.logger.log(`Found doctor: ${availableDoctor?.user?.fullName}, slots: ${availableDoctor?.slots?.length}`);

      if (availableDoctor && availableDoctor.slots.length > 0) {
        const slot = availableDoctor.slots[0];

        // Double check slot is still free
        const existingBooking = await this.prisma.booking.findFirst({
          where: { slotId: slot.id },
        });

        if (!existingBooking) {
          // Create the booking
          const newBooking = await this.prisma.booking.create({
            data: {
              patientId: userId,
              doctorId: availableDoctor.id,
              slotId: slot.id,
              status: 'CONFIRMED',
              sessionType: 'CLINIC',
              notes: 'Booked via AI chat assistant',
              bookedVia: 'AI_AGENT',
            },
          });

          // Mark slot as booked
          await this.prisma.slot.update({
            where: { id: slot.id },
            data: { isBooked: true },
          });

          this.logger.log(`✅ BOOKING CREATED: ${newBooking.id}`);

          // Build confirmation message in user's language
          const isArabic = /[\u0600-\u06FF]/.test(content);
          const isFrench = content.toLowerCase().includes('oui') ||
            content.toLowerCase().includes('confirmer');

          let confirmReply = '';

          if (isArabic) {
            confirmReply = `✅ تم الحجز بنجاح!
📅 التاريخ: ${new Date(slot.date).toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' })}
🕐 الوقت: ${slot.startTime}
👨‍⚕️ الدكتور: د. ${availableDoctor.user.fullName}
🏥 المركز: ${availableDoctor.center.name}

يمكنك مشاهدة الجلسة في صفحة الجلسات.`;
          } else if (isFrench) {
            confirmReply = `✅ Rendez-vous confirmé!
📅 Date: ${new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}
🕐 Heure: ${slot.startTime}
👨‍⚕️ Médecin: Dr. ${availableDoctor.user.fullName}
🏥 Centre: ${availableDoctor.center.name}

Vous pouvez voir votre séance dans la page Sessions.`;
          } else {
            confirmReply = `✅ Booking confirmed!
📅 Date: ${new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
🕐 Time: ${slot.startTime}
👨‍⚕️ Doctor: Dr. ${availableDoctor.user.fullName}
🏥 Center: ${availableDoctor.center.name}

You can view your session in the Sessions page.`;
          }

          const assistantMessage = await this.prisma.chatMessage.create({
            data: { sessionId, role: 'ASSISTANT', content: confirmReply },
          });

          return {
            userMessage: {
              id: userMessage.id,
              role: userMessage.role,
              content: userMessage.content,
              createdAt: userMessage.createdAt,
            },
            assistantMessage: {
              id: assistantMessage.id,
              role: assistantMessage.role,
              content: assistantMessage.content,
              createdAt: assistantMessage.createdAt,
            },
            extractedData: {},
            matchedDoctors: undefined,
            usedRAG: false,
            bookingCreated: true,
          };

        } else {
          this.logger.warn('Slot already booked — skipping');
        }
      } else {
        this.logger.warn('No available doctor found for confirmation');
      }
    }

    // Add right after the confirmation check
    this.logger.log('=== CONFIRMATION DEBUG ===');
    this.logger.log(`User message: "${content}"`);
    this.logger.log(`isConfirming: ${isConfirming}`);
    this.logger.log(`aiSuggestedBooking: ${aiSuggestedBooking}`);
    this.logger.log(`Last AI messages count: ${lastAiMessages.length}`);
    lastAiMessages.forEach((m, i) => {
      this.logger.log(`AI msg ${i}: "${m.content.slice(0, 50)}..."`);
    });
    this.logger.log('=========================');

    // 5. Call Python AI service
    let aiReply = "I'm sorry, the AI service is temporarily unavailable. Please try again in a moment.";
    let extractedData = {};
    let usedRAG = false;
    let suggestDoctors = false;

    let matchedDoctors: any[] = [];

    try {
      const response = await fetch(`${this.aiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history,
          userProfile: user?.healthProfile
            ? {
              age: user.healthProfile.age,
              gender: user.healthProfile.gender,
              backPain: user.healthProfile.backPain,
              jointPain: user.healthProfile.jointPain,
              sportsInjury: user.healthProfile.sportsInjury,
              neckIssues: user.healthProfile.neckIssues,
              activityLevel: user.healthProfile.activityLevel,
            }
            : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // ✅ ADD THESE LOGS
        console.log('=== AI SERVICE RESPONSE ===');
        console.log('Full data:', JSON.stringify(data, null, 2));
        console.log('data.reply:', data.reply);
        console.log('data.message:', data.message);
        console.log('data.message?.content:', data.message?.content);
        console.log('===========================');
        // ✅ Handle multiple AI response formats
        aiReply =
          data.reply                      // our standard format
          || data.message?.content        // Ollama format
          || data.content?.[0]?.text      // Anthropic SDK format
          || data.content                 // simple string
          || "I could not generate a response. Please try again.";

        // ✅ Guarantee it's always a non-empty string
        if (typeof aiReply !== 'string' || !aiReply.trim()) {
          aiReply = "I could not generate a response. Please try again.";
        }
        extractedData = data.extractedData ?? {};
        usedRAG = data.usedRAG ?? false;
        suggestDoctors = data.suggestDoctors ?? false;
      } else {
        const err = await response.text();
        this.logger.error(`AI service returned ${response.status}: ${err}`);
      }
    } catch (err: any) {
      this.logger.error('AI service unreachable:', err.message);
    }

    // 6. Match doctors if symptoms were detected
    // let matchedDoctors: any[] = [];

    // if ((extractedData as any).specialty) {
    //   const specialty = (extractedData as any).specialty as string;

    //   const doctors = await this.prisma.doctor.findMany({
    //     where: {
    //       isAvailable: true,
    //       specialties: { hasSome: [specialty] },
    //     },
    //     include: {
    //       user: true,
    //       center: true,
    //       slots: {
    //         where: {
    //           isBooked: false,
    //           date: { gte: new Date() }, // only future slots
    //         },
    //         orderBy: { date: 'asc' },
    //         take: 3, // next 3 available slots per doctor
    //       },
    //     },
    //     take: 3,
    //     orderBy: { rating: 'desc' },
    //   });

    //   matchedDoctors = doctors.map(d => ({
    //     id: d.id,
    //     name: d.user.fullName,
    //     specialties: d.specialties,
    //     rating: d.rating,
    //     price: d.pricePerSession,
    //     center: d.center.name,
    //     centerAddress: d.center.address,
    //     centerCity: d.center.city,
    //     languages: d.languages,
    //     bio: d.bio,
    //     isAvailable: d.isAvailable,
    //     avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
    //     availableSlots: d.slots.map(s => ({
    //       id: s.id,
    //       date: s.date,
    //       startTime: s.startTime,
    //       endTime: s.endTime,
    //     })),
    //     hasAvailableSlots: d.slots.length > 0,
    //   }));

    //   this.logger.log(
    //     `Matched ${matchedDoctors.length} doctors for specialty: ${specialty}`,
    //   );
    // }
    if (suggestDoctors || (extractedData as any).symptoms?.length > 0) {
      const symptoms = (extractedData as any).symptoms ?? [];
      const specialty = (extractedData as any).specialty;

      // Get all available doctors with their slots
      const doctors = await this.prisma.doctor.findMany({
        where: { isAvailable: true },
        include: {
          user: true,
          center: true,
          slots: {
            where: { isBooked: false, date: { gte: new Date() } },
          },
        },
        take: 10,
        orderBy: { rating: 'desc' },
      });

      // Score each doctor based on symptoms and specialty
      const scored = await Promise.all(
        doctors.map(async d => {
          let score = 0;

          // Specialty match
          if (specialty && specialty !== 'null') {
            const specialtyLower = specialty.toLowerCase();
            const doctorSpecs = d.specialties.map(s => s.toLowerCase());
            if (doctorSpecs.some(s => s.includes(specialtyLower) || specialtyLower.includes(s))) {
              score += 40;
            }
          }

          // Symptom keyword match
          symptoms.forEach((sym: string) => {
            const symLower = sym.toLowerCase();
            const specs = d.specialties.map(s => s.toLowerCase());
            if (specs.some(s => s.includes(symLower) || symLower.includes(s))) {
              score += 15;
            }
          });

          // Rating boost
          score += Math.round(((d.rating ?? 0) / 5) * 20);

          // Availability boost
          if (d.slots.length > 0) score += 10;

          return {
            id: d.id,
            name: d.user.fullName,
            specialty: d.specialties[0] ?? 'General Physiotherapy',
            rating: d.rating ?? 0,
            price: d.pricePerSession ?? 0,
            center: d.center?.name ?? '',
            avatarUrl: d.user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(d.user.fullName)}&background=3b82f6&color=fff&size=128`,
            matchScore: Math.min(100, score),
            slotsAvailable: d.slots.length,
          };
        }),
      );

      // Only return doctors with meaningful match score
      matchedDoctors = scored
        .filter(d => d.matchScore > 20)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      this.logger.log(
        `Matched ${matchedDoctors.length} doctors for symptoms: ${symptoms.join(', ')}`,
      );
    }

    // 7. Save AI reply
    const assistantMessage = await this.prisma.chatMessage.create({
      data: { sessionId, role: 'ASSISTANT', content: aiReply },
    });

    if ((extractedData as any).symptoms?.length > 0) {
      const symptoms = (extractedData as any).symptoms as string[];
      const bodyPart = (extractedData as any).bodyPart as string || '';

      const profileUpdate: Record<string, any> = {};

      // Map extracted symptoms to profile fields
      if (symptoms.some(s => s.toLowerCase().includes('back') || bodyPart.includes('back'))) {
        profileUpdate.backPain = true;
        profileUpdate.primarySymptom = 'back pain';
      }
      if (symptoms.some(s => s.toLowerCase().includes('neck') || bodyPart.includes('neck'))) {
        profileUpdate.neckIssues = true;
        profileUpdate.primarySymptom = 'neck pain';
      }
      if (symptoms.some(s => s.toLowerCase().includes('joint') || s.toLowerCase().includes('knee'))) {
        profileUpdate.jointPain = true;
        profileUpdate.primarySymptom = 'joint pain';
      }
      if (symptoms.some(s => s.toLowerCase().includes('sport'))) {
        profileUpdate.sportsInjury = true;
        profileUpdate.primarySymptom = 'sports injury';
      }

      if (Object.keys(profileUpdate).length > 0) {
        await this.prisma.healthProfile.upsert({
          where: { userId },
          create: { userId, ...profileUpdate },
          update: profileUpdate,
        }).catch(() => { });

        this.logger.log(`Updated health profile for user ${userId} from chat symptoms`);
      }
    }

    // 8. Detect if AI confirmed a booking and create it automatically
    if (suggestDoctors && matchedDoctors.length > 0) {
      const lowerContent = content.toLowerCase();
      const isConfirmation =
        lowerContent.includes('book') ||
        lowerContent.includes('schedule') ||
        lowerContent.includes('appointment') ||
        lowerContent.includes('reserve');

      if (isConfirmation && matchedDoctors.length > 0) {
        // Find the first available doctor with slots
        const doctorWithSlot = matchedDoctors.find(d => d.availableSlots?.length > 0);

        if (doctorWithSlot && doctorWithSlot.availableSlots[0]) {
          const slot = doctorWithSlot.availableSlots[0];

          // Check slot is not already booked
          const existingBooking = await this.prisma.booking.findFirst({
            where: { slotId: slot.id },
          });

          if (!existingBooking) {
            await this.prisma.booking.create({
              data: {
                patientId: userId,
                doctorId: doctorWithSlot.id,
                slotId: slot.id,
                status: 'CONFIRMED',
                sessionType: 'CLINIC',
                notes: `Booked via AI chat — ${(extractedData as any).specialty || 'General'}`,
                bookedVia: 'AI_AGENT',
              },
            });

            await this.prisma.slot.update({
              where: { id: slot.id },
              data: { isBooked: true },
            });

            this.logger.log(
              `AI booked session: patient ${userId} with doctor ${doctorWithSlot.id} at slot ${slot.id}`,
            );
          }
        }
      }
    }

    // 9. Update session title from first message
    if (recentMessages.length === 0) {
      const title = content.length > 50
        ? content.slice(0, 47) + '...'
        : content;
      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
      });
    }

    return {
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
      // Extra data for frontend to use
      extractedData,
      matchedDoctors: matchedDoctors.length > 0 ? matchedDoctors : undefined,
      usedRAG,
    };
  }

  // ── Clear session ─────────────────────────────────────────────
  async clearSession(userId: string) {
    const sessionId = await this.getOrCreateSession(userId);
    await this.prisma.chatMessage.deleteMany({ where: { sessionId } });
    return { cleared: true };
  }
}