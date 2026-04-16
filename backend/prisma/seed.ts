import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── 1. Centers ────────────────────────────────────────────
  const center1 = await prisma.center.create({
    data: {
      name: 'Doha Sports Medicine Center',
      address: 'Al Sadd Street, Building 45',
      city: 'Doha',
      phone: '+974 4444 5555',
      email: 'info@dohasports.qa',
      specialties: ['Musculoskeletal', 'Sports Rehabilitation', 'Manual Therapy'],
    },
  });

  const center2 = await prisma.center.create({
    data: {
      name: 'Qatar Physiotherapy Center',
      address: 'West Bay, Tower 12',
      city: 'Doha',
      phone: '+974 4000 1234',
      email: 'info@qatarphysio.qa',
      specialties: ['Orthopedic', 'Spine Care', 'Pediatric'],
    },
  });

  const center3 = await prisma.center.create({
    data: {
      name: 'Al Rayyan Rehabilitation Clinic',
      address: 'Al Rayyan Road, Block 5',
      city: 'Al Rayyan',
      phone: '+974 4333 2222',
      email: 'info@alrayyanrehab.qa',
      specialties: ['Neurological', 'Post-Surgery', 'Pain Management'],
    },
  });

  console.log('✅ Centers created');

  // ── 2. Doctors ────────────────────────────────────────────
  const doctorPassword = await bcrypt.hash('doctor123', 10);

  const doctorUser1 = await prisma.user.create({
    data: {
      email: 'dr.sarah@physioai.qa',
      passwordHash: doctorPassword,
      fullName: 'Sarah Al-Rashid',
      role: 'DOCTOR',
      phone: '+974 5551 0001',
      doctor: {
        create: {
          centerId: center1.id,
          specialties: ['Musculoskeletal Specialist', 'Sports Injuries', 'Manual Therapy'],
          bio: 'Expert in lower back and joint recovery with 8 years experience.',
          rating: 4.9,
          pricePerSession: 180,
          languages: ['English', 'Arabic'],
          isAvailable: true,
        },
      },
    },
    include: { doctor: true },
  });

  const doctorUser2 = await prisma.user.create({
    data: {
      email: 'dr.ahmed@physioai.qa',
      passwordHash: doctorPassword,
      fullName: 'Ahmed Hassan',
      role: 'DOCTOR',
      phone: '+974 5551 0002',
      doctor: {
        create: {
          centerId: center2.id,
          specialties: ['Orthopedic Physiotherapist', 'Spine Care', 'Acupuncture'],
          bio: 'Specialized in spine care and orthopedic rehabilitation with 12 years experience.',
          rating: 4.7,
          pricePerSession: 160,
          languages: ['Arabic', 'English', 'French'],
          isAvailable: true,
        },
      },
    },
    include: { doctor: true },
  });

  const doctorUser3 = await prisma.user.create({
    data: {
      email: 'dr.fatima@physioai.qa',
      passwordHash: doctorPassword,
      fullName: 'Fatima Al-Zahra',
      role: 'DOCTOR',
      phone: '+974 5551 0003',
      doctor: {
        create: {
          centerId: center1.id,
          specialties: ['Sports Medicine', 'Rehabilitation', 'Pediatric Physio'],
          bio: 'Sports medicine specialist focusing on athletic performance and recovery.',
          rating: 4.8,
          pricePerSession: 200,
          languages: ['English', 'Arabic', 'French'],
          isAvailable: true,
        },
      },
    },
    include: { doctor: true },
  });

  const doctorUser4 = await prisma.user.create({
    data: {
      email: 'dr.omar@physioai.qa',
      passwordHash: doctorPassword,
      fullName: 'Omar Khalil',
      role: 'DOCTOR',
      phone: '+974 5551 0004',
      doctor: {
        create: {
          centerId: center3.id,
          specialties: ['Neurological Physiotherapy', 'Post-Surgery Rehab', 'Pain Management'],
          bio: 'Expert in neurological conditions and post-surgical rehabilitation.',
          rating: 4.9,
          pricePerSession: 220,
          languages: ['Arabic', 'English'],
          isAvailable: true,
        },
      },
    },
    include: { doctor: true },
  });

  const doctorUser5 = await prisma.user.create({
    data: {
      email: 'dr.amina@physioai.qa',
      passwordHash: doctorPassword,
      fullName: 'Amina Hassan',
      role: 'DOCTOR',
      phone: '+974 5551 0005',
      doctor: {
        create: {
          centerId: center2.id,
          specialties: ['Sports Rehabilitation', 'Injury Prevention', 'Pilates Therapy'],
          bio: 'Specialized in sports rehabilitation and injury prevention programs.',
          rating: 4.6,
          pricePerSession: 150,
          languages: ['English', 'Arabic'],
          isAvailable: true,
        },
      },
    },
    include: { doctor: true },
  });

  console.log('✅ Doctors created (5)');

  // ── 3. Patients ───────────────────────────────────────────
  const patientPassword = await bcrypt.hash('patient123', 10);

  const patient1 = await prisma.user.create({
    data: {
      email: 'ahmed@physioai.qa',
      passwordHash: patientPassword,
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

  const patient2 = await prisma.user.create({
    data: {
      email: 'sarah@physioai.qa',
      passwordHash: patientPassword,
      fullName: 'Sarah Al-Qassim',
      role: 'PATIENT',
      phone: '+974 5555 5678',
      healthProfile: {
        create: {
          age: '18-25',
          gender: 'female',
          sportsInjury: true,
          activityLevel: 'High',
        },
      },
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'khalid@physioai.qa',
      passwordHash: patientPassword,
      fullName: 'Khalid Al-Thani',
      role: 'PATIENT',
      phone: '+974 5555 9012',
      healthProfile: {
        create: {
          age: '46-55',
          gender: 'male',
          jointPain: true,
          neckIssues: true,
          activityLevel: 'Low',
        },
      },
    },
  });

  const patient4 = await prisma.user.create({
    data: {
      email: 'layla@physioai.qa',
      passwordHash: patientPassword,
      fullName: 'Layla Ahmed',
      role: 'PATIENT',
      phone: '+974 5555 3456',
      healthProfile: {
        create: {
          age: '36-45',
          gender: 'female',
          backPain: true,
          jointPain: true,
          activityLevel: 'Moderate',
        },
      },
    },
  });

  console.log('✅ Patients created (4)');

  // ── 4. Health Insights ────────────────────────────────────
  await prisma.healthInsight.createMany({
    data: [
      {
        userId: patient1.id,
        heartRate: 72,
        dailySteps: 8547,
        exerciseSessions: 5,
        totalSessions: 5,
        painLevel: 2.1,
        sleepQuality: 8.3,
      },
      {
        userId: patient2.id,
        heartRate: 68,
        dailySteps: 12000,
        exerciseSessions: 6,
        totalSessions: 6,
        painLevel: 1.5,
        sleepQuality: 9.0,
      },
      {
        userId: patient3.id,
        heartRate: 78,
        dailySteps: 4200,
        exerciseSessions: 3,
        totalSessions: 5,
        painLevel: 5.2,
        sleepQuality: 6.5,
      },
      {
        userId: patient4.id,
        heartRate: 74,
        dailySteps: 6800,
        exerciseSessions: 4,
        totalSessions: 5,
        painLevel: 3.8,
        sleepQuality: 7.2,
      },
    ],
  });

  console.log('✅ Health insights created');

  // ── 5. Reminders ──────────────────────────────────────────
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  await prisma.reminder.createMany({
    data: [
      {
        userId: patient1.id,
        title: 'Session Reminder',
        message: `Physiotherapy session with Dr. Sarah Al-Rashid at Doha Sports Medicine Center`,
        type: 'SESSION',
        time: `Tomorrow, ${tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        isActive: true,
      },
      {
        userId: patient1.id,
        title: 'Exercise Time',
        message: 'Daily stretching routine — lower back exercises',
        type: 'EXERCISE',
        time: 'Daily, 7:00 PM',
        isActive: true,
      },
      {
        userId: patient1.id,
        title: 'Medication Time',
        message: 'Anti-inflammatory medication after meals',
        type: 'MEDICATION',
        time: 'Every 6 hours',
        isActive: true,
      },
    ],
  });

  console.log('✅ Reminders created');

  // ── 6. Slots ──────────────────────────────────────────────
  // Past slots
  const past = (days: number) => new Date(today.getTime() - days * 86400000);
  const future = (days: number) => new Date(today.getTime() + days * 86400000);

  // Patient 1 — Ahmed (past completed + future upcoming)
  const slots_p1 = await Promise.all([
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: past(21), startTime: '10:00 AM', endTime: '11:00 AM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: past(14), startTime: '2:00 PM',  endTime: '3:00 PM',  isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser2.doctor!.id, date: past(10), startTime: '11:00 AM', endTime: '12:00 PM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: past(7),  startTime: '3:00 PM',  endTime: '4:00 PM',  isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser3.doctor!.id, date: past(3),  startTime: '9:00 AM',  endTime: '10:00 AM', isBooked: true } }),
    // future
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: future(1), startTime: '10:00 AM', endTime: '11:00 AM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser2.doctor!.id, date: future(4), startTime: '2:30 PM',  endTime: '3:30 PM',  isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser3.doctor!.id, date: future(7), startTime: '11:00 AM', endTime: '12:00 PM', isBooked: true } }),
  ]);

  // Patient 2 — Sarah
  const slots_p2 = await Promise.all([
    prisma.slot.create({ data: { doctorId: doctorUser3.doctor!.id, date: past(15), startTime: '9:00 AM',  endTime: '10:00 AM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser5.doctor!.id, date: past(8),  startTime: '11:00 AM', endTime: '12:00 PM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser3.doctor!.id, date: future(2), startTime: '3:00 PM',  endTime: '4:00 PM',  isBooked: true } }),
  ]);

  // Patient 3 — Khalid
  const slots_p3 = await Promise.all([
    prisma.slot.create({ data: { doctorId: doctorUser4.doctor!.id, date: past(12), startTime: '10:00 AM', endTime: '11:00 AM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser2.doctor!.id, date: past(5),  startTime: '2:00 PM',  endTime: '3:00 PM',  isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser4.doctor!.id, date: future(3), startTime: '10:00 AM', endTime: '11:00 AM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser4.doctor!.id, date: future(6), startTime: '2:00 PM',  endTime: '3:00 PM',  isBooked: true } }),
  ]);

  // Patient 4 — Layla
  const slots_p4 = await Promise.all([
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: past(10), startTime: '11:00 AM', endTime: '12:00 PM', isBooked: true } }),
    prisma.slot.create({ data: { doctorId: doctorUser5.doctor!.id, date: future(2), startTime: '9:00 AM',  endTime: '10:00 AM', isBooked: true } }),
  ]);

  // Free slots (not booked)
  await Promise.all([
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: future(2),  startTime: '2:00 PM',  endTime: '3:00 PM',  isBooked: false } }),
    prisma.slot.create({ data: { doctorId: doctorUser1.doctor!.id, date: future(3),  startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false } }),
    prisma.slot.create({ data: { doctorId: doctorUser2.doctor!.id, date: future(1),  startTime: '9:00 AM',  endTime: '10:00 AM', isBooked: false } }),
    prisma.slot.create({ data: { doctorId: doctorUser3.doctor!.id, date: future(2),  startTime: '11:00 AM', endTime: '12:00 PM', isBooked: false } }),
    prisma.slot.create({ data: { doctorId: doctorUser4.doctor!.id, date: future(1),  startTime: '3:00 PM',  endTime: '4:00 PM',  isBooked: false } }),
    prisma.slot.create({ data: { doctorId: doctorUser5.doctor!.id, date: future(3),  startTime: '4:00 PM',  endTime: '5:00 PM',  isBooked: false } }),
  ]);

  console.log('✅ Slots created');

  // ── 7. Bookings ───────────────────────────────────────────
  // Patient 1 — Ahmed (5 completed + 3 upcoming)
  await prisma.booking.createMany({
    data: [
      { patientId: patient1.id, doctorId: doctorUser1.doctor!.id, slotId: slots_p1[0].id, status: 'COMPLETED', sessionType: 'CLINIC',      notes: 'Initial lower back assessment', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser1.doctor!.id, slotId: slots_p1[1].id, status: 'COMPLETED', sessionType: 'HOME_VISIT',   notes: 'Core strengthening exercises', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser2.doctor!.id, slotId: slots_p1[2].id, status: 'COMPLETED', sessionType: 'CLINIC',      notes: 'Spine alignment check', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser1.doctor!.id, slotId: slots_p1[3].id, status: 'COMPLETED', sessionType: 'CLINIC',      notes: 'Manual therapy session', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser3.doctor!.id, slotId: slots_p1[4].id, status: 'COMPLETED', sessionType: 'HOME_VISIT',   notes: 'Mobility improvement exercises', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser1.doctor!.id, slotId: slots_p1[5].id, status: 'CONFIRMED', sessionType: 'CLINIC',      notes: 'Follow-up lower back therapy', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser2.doctor!.id, slotId: slots_p1[6].id, status: 'PENDING',   sessionType: 'HOME_VISIT',   notes: 'Shoulder mobility session', bookedVia: 'APP' },
      { patientId: patient1.id, doctorId: doctorUser3.doctor!.id, slotId: slots_p1[7].id, status: 'CONFIRMED', sessionType: 'CLINIC',      notes: 'Final assessment session', bookedVia: 'APP' },
    ],
  });

  // Patient 2 — Sarah
  await prisma.booking.createMany({
    data: [
      { patientId: patient2.id, doctorId: doctorUser3.doctor!.id, slotId: slots_p2[0].id, status: 'COMPLETED', sessionType: 'CLINIC',    notes: 'Sports injury assessment', bookedVia: 'APP' },
      { patientId: patient2.id, doctorId: doctorUser5.doctor!.id, slotId: slots_p2[1].id, status: 'COMPLETED', sessionType: 'CLINIC',    notes: 'Knee rehabilitation', bookedVia: 'APP' },
      { patientId: patient2.id, doctorId: doctorUser3.doctor!.id, slotId: slots_p2[2].id, status: 'CONFIRMED', sessionType: 'HOME_VISIT', notes: 'Recovery follow-up', bookedVia: 'APP' },
    ],
  });

  // Patient 3 — Khalid
  await prisma.booking.createMany({
    data: [
      { patientId: patient3.id, doctorId: doctorUser4.doctor!.id, slotId: slots_p3[0].id, status: 'COMPLETED', sessionType: 'CLINIC',    notes: 'Neurological assessment', bookedVia: 'APP' },
      { patientId: patient3.id, doctorId: doctorUser2.doctor!.id, slotId: slots_p3[1].id, status: 'COMPLETED', sessionType: 'CLINIC',    notes: 'Neck pain treatment', bookedVia: 'APP' },
      { patientId: patient3.id, doctorId: doctorUser4.doctor!.id, slotId: slots_p3[2].id, status: 'PENDING',   sessionType: 'CLINIC',    notes: 'Joint pain follow-up', bookedVia: 'APP' },
      { patientId: patient3.id, doctorId: doctorUser4.doctor!.id, slotId: slots_p3[3].id, status: 'CONFIRMED', sessionType: 'HOME_VISIT', notes: 'Home therapy session', bookedVia: 'APP' },
    ],
  });

  // Patient 4 — Layla
  await prisma.booking.createMany({
    data: [
      { patientId: patient4.id, doctorId: doctorUser1.doctor!.id, slotId: slots_p4[0].id, status: 'COMPLETED', sessionType: 'CLINIC',    notes: 'Back pain assessment', bookedVia: 'APP' },
      { patientId: patient4.id, doctorId: doctorUser5.doctor!.id, slotId: slots_p4[1].id, status: 'CONFIRMED', sessionType: 'CLINIC',    notes: 'Pilates therapy session', bookedVia: 'APP' },
    ],
  });

  console.log('✅ Bookings created');

  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('👤 Patient accounts:');
  console.log('  ahmed@physioai.qa   / patient123  (8 bookings)');
  console.log('  sarah@physioai.qa   / patient123  (3 bookings)');
  console.log('  khalid@physioai.qa  / patient123  (4 bookings)');
  console.log('  layla@physioai.qa   / patient123  (2 bookings)');
  console.log('');
  console.log('👨‍⚕️ Doctor accounts:');
  console.log('  dr.sarah@physioai.qa   / doctor123');
  console.log('  dr.ahmed@physioai.qa   / doctor123');
  console.log('  dr.fatima@physioai.qa  / doctor123');
  console.log('  dr.omar@physioai.qa    / doctor123');
  console.log('  dr.amina@physioai.qa   / doctor123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());