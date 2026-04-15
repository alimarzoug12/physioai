import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // ── 1. Create Center ──────────────────────────────────────
    const center = await prisma.center.create({
        data: {
            name: 'Doha Physiotherapy Center',
            address: '123 Al Corniche St',
            city: 'Doha',
            phone: '+974 4000 1234',
            specialties: ['Musculoskeletal', 'Sports Rehabilitation'],
        },
    });
    console.log('✅ Center created:', center.name);

    // ── 2. Create Doctor ──────────────────────────────────────
    const doctorPasswordHash = await bcrypt.hash('doctor123', 10);
    const doctorUser = await prisma.user.create({
        data: {
            email: 'dr.sarah@physioai.qa',
            passwordHash: doctorPasswordHash,
            fullName: 'Sarah Al-Rashid',
            role: 'DOCTOR',
            doctor: {
                create: {
                    centerId: center.id,
                    specialties: ['Musculoskeletal Specialist', 'Sports Injuries'],
                    bio: 'Expert in lower back and joint recovery.',
                    rating: 4.9,
                    pricePerSession: 150,
                    languages: ['English', 'Arabic'],
                    isAvailable: true,
                },
            },
        },
        include: { doctor: true },
    });
    console.log('✅ Doctor created:', doctorUser.fullName);

    // ── 3. Create Patient ─────────────────────────────────────
    const patientPasswordHash = await bcrypt.hash('patient123', 10);
    const patientUser = await prisma.user.create({
        data: {
            email: 'ahmed@physioai.qa',
            passwordHash: patientPasswordHash,
            fullName: 'Ahmed Al-Mansouri',
            role: 'PATIENT',
            phone: '+974 5555 1234',
            healthProfile: {
                create: {
                    age: '26-35',
                    gender: 'male',
                    backPain: true,
                    activityLevel: 'Moderate',
                },
            },
        },
    });
    console.log('✅ Patient created:', patientUser.fullName);

    // ── 4. Create Slots ───────────────────────────────────────
    const today = new Date();

    const slot1 = await prisma.slot.create({
        data: {
            doctorId: doctorUser.doctor!.id,
            date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
            startTime: '10:00 AM',
            endTime: '11:00 AM',
            isBooked: true,
        },
    });

    const slot2 = await prisma.slot.create({
        data: {
            doctorId: doctorUser.doctor!.id,
            date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // in 3 days
            startTime: '2:00 PM',
            endTime: '3:00 PM',
            isBooked: true,
        },
    });

    const slot3 = await prisma.slot.create({
        data: {
            doctorId: doctorUser.doctor!.id,
            date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            startTime: '11:00 AM',
            endTime: '12:00 PM',
            isBooked: true,
        },
    });

    const slot4 = await prisma.slot.create({
        data: {
            doctorId: doctorUser.doctor!.id,
            date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            startTime: '3:00 PM',
            endTime: '4:00 PM',
            isBooked: true,
        },
    });

    console.log('✅ Slots created');

    // ── 5. Create Bookings ────────────────────────────────────
    await prisma.booking.create({
        data: {
            patientId: patientUser.id,
            doctorId: doctorUser.doctor!.id,
            slotId: slot1.id,
            status: 'CONFIRMED',
            sessionType: 'CLINIC',
            notes: 'Lower back pain treatment',
            bookedVia: 'APP',
        },
    });

    await prisma.booking.create({
        data: {
            patientId: patientUser.id,
            doctorId: doctorUser.doctor!.id,
            slotId: slot2.id,
            status: 'PENDING',
            sessionType: 'HOME_VISIT',
            notes: 'Follow-up session',
            bookedVia: 'APP',
        },
    });

    await prisma.booking.create({
        data: {
            patientId: patientUser.id,
            doctorId: doctorUser.doctor!.id,
            slotId: slot3.id,
            status: 'COMPLETED',
            sessionType: 'CLINIC',
            notes: 'Initial assessment',
            bookedVia: 'APP',
        },
    });

    await prisma.booking.create({
        data: {
            patientId: patientUser.id,
            doctorId: doctorUser.doctor!.id,
            slotId: slot4.id,
            status: 'COMPLETED',
            sessionType: 'CLINIC',
            notes: 'Exercise therapy session',
            bookedVia: 'APP',
        },
    });

    // ── 6. Create Health Insight ──────────────────────────────
    await prisma.healthInsight.create({
        data: {
            userId: patientUser.id,
            heartRate: 72,
            dailySteps: 8547,
            exerciseSessions: 5,
            totalSessions: 5,
            painLevel: 2.1,
            sleepQuality: 8.3,
        },
    });
    console.log('✅ Health insight created');

    // ── 7. Create Reminders ───────────────────────────────────
    await prisma.reminder.createMany({
        data: [
            {
                userId: patientUser.id,
                title: 'Session Reminder',
                message: 'Shoulder therapy tomorrow at 10:00 AM',
                type: 'SESSION',
                time: 'Tomorrow, 10:00 AM',
                isActive: true,
            },
            {
                userId: patientUser.id,
                title: 'Exercise Time',
                message: 'Daily stretching routine in 30 minutes',
                type: 'EXERCISE',
                time: 'Daily, 7:00 PM',
                isActive: true,
            },
            {
                userId: patientUser.id,
                title: 'Medication Time',
                message: 'Take prescribed supplements',
                type: 'MEDICATION',
                time: 'Every 6 hours',
                isActive: true,
            },
        ],
    });
    console.log('✅ Reminders created');

    console.log('✅ Bookings created');
    console.log('');
    console.log('🎉 Seed complete!');
    console.log('');
    console.log('Test accounts:');
    console.log('  Patient: ahmed@physioai.qa / patient123');
    console.log('  Doctor:  dr.sarah@physioai.qa / doctor123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());