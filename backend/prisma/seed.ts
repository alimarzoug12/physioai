// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── helpers ────────────────────────────────────────────────────────
const past = (d: number) => new Date(Date.now() - d * 86_400_000);
const future = (d: number) => new Date(Date.now() + d * 86_400_000);
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('🌱 Starting rich seed...');
//this makes all the user accounts verified to avoid email verification step during testing and development******
  await prisma.user.updateMany({
    where: { emailVerified: false },
    data: { emailVerified: true },
  });
  console.log('✅ All existing users marked as verified');

  // ── 1. Centers ─────────────────────────────────────────────────
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
  console.log('✅ Centers created (3)');

  // ── 2. Doctors ──────────────────────────────────────────────────
  const doctorPwd = await bcrypt.hash('doctor123', 10);

  const d1 = await prisma.user.create({
    data: {
      email: 'dr.sarah@physioai.qa', passwordHash: doctorPwd,
      fullName: 'Sarah Al-Rashid', role: 'DOCTOR', phone: '+974 5551 0001',
      doctor: { create: { centerId: center1.id, specialties: ['Musculoskeletal Specialist', 'Sports Injuries', 'Manual Therapy'], bio: 'Expert in lower back and joint recovery with 8 years experience.', rating: 4.9, pricePerSession: 180, languages: ['English', 'Arabic'], isAvailable: true } },
    },
    include: { doctor: true },
  });
  const d2 = await prisma.user.create({
    data: {
      email: 'dr.ahmed@physioai.qa', passwordHash: doctorPwd,
      fullName: 'Ahmed Hassan', role: 'DOCTOR', phone: '+974 5551 0002',
      doctor: { create: { centerId: center2.id, specialties: ['Orthopedic Physiotherapist', 'Spine Care', 'Acupuncture'], bio: 'Specialized in spine care and orthopedic rehabilitation with 12 years experience.', rating: 4.7, pricePerSession: 160, languages: ['Arabic', 'English', 'French'], isAvailable: true } },
    },
    include: { doctor: true },
  });
  const d3 = await prisma.user.create({
    data: {
      email: 'dr.fatima@physioai.qa', passwordHash: doctorPwd,
      fullName: 'Fatima Al-Zahra', role: 'DOCTOR', phone: '+974 5551 0003',
      doctor: { create: { centerId: center1.id, specialties: ['Sports Medicine', 'Rehabilitation', 'Pediatric Physio'], bio: 'Sports medicine specialist focusing on athletic performance and recovery with 6 years experience.', rating: 4.8, pricePerSession: 200, languages: ['English', 'Arabic', 'French'], isAvailable: true } },
    },
    include: { doctor: true },
  });
  const d4 = await prisma.user.create({
    data: {
      email: 'dr.omar@physioai.qa', passwordHash: doctorPwd,
      fullName: 'Omar Khalil', role: 'DOCTOR', phone: '+974 5551 0004',
      doctor: { create: { centerId: center3.id, specialties: ['Neurological Physiotherapy', 'Post-Surgery Rehab', 'Pain Management'], bio: 'Expert in neurological conditions and post-surgical rehabilitation with 15 years experience.', rating: 4.9, pricePerSession: 220, languages: ['Arabic', 'English'], isAvailable: true } },
    },
    include: { doctor: true },
  });
  const d5 = await prisma.user.create({
    data: {
      email: 'dr.amina@physioai.qa', passwordHash: doctorPwd,
      fullName: 'Amina Hassan', role: 'DOCTOR', phone: '+974 5551 0005',
      doctor: { create: { centerId: center2.id, specialties: ['Sports Rehabilitation', 'Injury Prevention', 'Pilates Therapy'], bio: 'Specialized in sports rehabilitation and injury prevention programs with 5 years experience.', rating: 4.6, pricePerSession: 150, languages: ['English', 'Arabic'], isAvailable: true } },
    },
    include: { doctor: true },
  });
  console.log('✅ Doctors created (5)');

  // ── 3. Patients ─────────────────────────────────────────────────
  // 20 patients — more per doctor for richer analytics
  const patientPwd = await bcrypt.hash('patient123', 10);

  const patientData = [
    // Main test accounts
    { email: 'ahmed@physioai.qa', fullName: 'Ahmed Al-Mansouri', phone: '+974 5555 1234', age: '26-35', gender: 'male', backPain: true, activityLevel: 'Moderate', balance: 2450.00, points: 2450 },
    { email: 'sarah@physioai.qa', fullName: 'Sarah Al-Qassim', phone: '+974 5555 5678', age: '18-25', gender: 'female', sportsInjury: true, activityLevel: 'High', balance: 800.00, points: 800 },
    { email: 'khalid@physioai.qa', fullName: 'Khalid Al-Thani', phone: '+974 5555 9012', age: '46-55', gender: 'male', jointPain: true, activityLevel: 'Low', balance: 1200.00, points: 1200 },
    { email: 'layla@physioai.qa', fullName: 'Layla Ahmed', phone: '+974 5555 3456', age: '36-45', gender: 'female', backPain: true, activityLevel: 'Moderate', balance: 650.00, points: 650 },
    // Extra patients for Dr. Sarah (d1)
    { email: 'hassan@physioai.qa', fullName: 'Hassan Al-Rashid', phone: '+974 5556 0001', age: '36-45', gender: 'male', backPain: true, activityLevel: 'Low', balance: 3200.00, points: 3200 },
    { email: 'noor@physioai.qa', fullName: 'Noor Abdullah', phone: '+974 5556 0002', age: '26-35', gender: 'female', jointPain: true, activityLevel: 'Moderate', balance: 550.00, points: 550 },
    { email: 'faisal@physioai.qa', fullName: 'Faisal Al-Mutawa', phone: '+974 5556 0003', age: '46-55', gender: 'male', backPain: true, activityLevel: 'High', balance: 1800.00, points: 1800 },
    { email: 'mona@physioai.qa', fullName: 'Mona Al-Sayed', phone: '+974 5556 0004', age: '18-25', gender: 'female', sportsInjury: true, activityLevel: 'High', balance: 400.00, points: 400 },
    { email: 'tariq@physioai.qa', fullName: 'Tariq Al-Dosari', phone: '+974 5556 0005', age: '56-65', gender: 'male', jointPain: true, activityLevel: 'Low', balance: 5000.00, points: 5000 },
    // Extra patients for Dr. Ahmed (d2)
    { email: 'reem@physioai.qa', fullName: 'Reem Al-Kuwari', phone: '+974 5556 0006', age: '26-35', gender: 'female', backPain: true, activityLevel: 'Moderate', balance: 920.00, points: 920 },
    { email: 'jaber@physioai.qa', fullName: 'Jaber Al-Harbi', phone: '+974 5556 0007', age: '36-45', gender: 'male', backPain: true, activityLevel: 'Low', balance: 2100.00, points: 2100 },
    { email: 'hessa@physioai.qa', fullName: 'Hessa Al-Marri', phone: '+974 5556 0008', age: '46-55', gender: 'female', neckIssues: true, activityLevel: 'Low', balance: 750.00, points: 750 },
    // Extra patients for Dr. Fatima (d3)
    { email: 'yousef@physioai.qa', fullName: 'Yousef Al-Naimi', phone: '+974 5556 0009', age: '18-25', gender: 'male', sportsInjury: true, activityLevel: 'High', balance: 300.00, points: 300 },
    { email: 'aisha@physioai.qa', fullName: 'Aisha Al-Mannai', phone: '+974 5556 0010', age: '26-35', gender: 'female', backPain: true, activityLevel: 'Moderate', balance: 1400.00, points: 1400 },
    { email: 'salem@physioai.qa', fullName: 'Salem Al-Shammari', phone: '+974 5556 0011', age: '36-45', gender: 'male', jointPain: true, activityLevel: 'Moderate', balance: 600.00, points: 600 },
    // Extra patients for Dr. Omar (d4)
    { email: 'fatma@physioai.qa', fullName: 'Fatma Al-Sulaiti', phone: '+974 5556 0012', age: '56-65', gender: 'female', neckIssues: true, activityLevel: 'Low', balance: 4500.00, points: 4500 },
    { email: 'walid@physioai.qa', fullName: 'Walid Al-Kaabi', phone: '+974 5556 0013', age: '46-55', gender: 'male', backPain: true, activityLevel: 'Low', balance: 1650.00, points: 1650 },
    // Extra patients for Dr. Amina (d5)
    { email: 'mariam@physioai.qa', fullName: 'Mariam Al-Hajri', phone: '+974 5556 0014', age: '18-25', gender: 'female', sportsInjury: true, activityLevel: 'High', balance: 250.00, points: 250 },
    { email: 'abdulla@physioai.qa', fullName: 'Abdulla Al-Fayez', phone: '+974 5556 0015', age: '26-35', gender: 'male', backPain: true, activityLevel: 'Moderate', balance: 980.00, points: 980 },
    { email: 'shaikha@physioai.qa', fullName: 'Shaikha Al-Romaihi', phone: '+974 5556 0016', age: '36-45', gender: 'female', jointPain: true, activityLevel: 'Moderate', balance: 3100.00, points: 3100 },
  ];

  const patients: any[] = [];
  for (const p of patientData) {
    const user = await prisma.user.create({
      data: {
        email: p.email, passwordHash: patientPwd,
        fullName: p.fullName, role: 'PATIENT', phone: p.phone,
        healthProfile: {
          create: {
            age: p.age, gender: p.gender,
            backPain: (p as any).backPain ?? false,
            jointPain: (p as any).jointPain ?? false,
            sportsInjury: (p as any).sportsInjury ?? false,
            neckIssues: (p as any).neckIssues ?? false,
            activityLevel: p.activityLevel,
          },
        },
      },
    });
    patients.push({ ...user, balance: p.balance, points: p.points });
  }
  console.log(`✅ Patients created (${patients.length})`);

  // ── 4. Health Insights for all patients ────────────────────────
  await prisma.healthInsight.createMany({
    data: patients.map(p => ({
      userId: p.id,
      heartRate: rand(62, 88),
      dailySteps: rand(3000, 14000),
      exerciseSessions: rand(2, 6),
      totalSessions: rand(3, 7),
      painLevel: parseFloat((Math.random() * 6 + 1).toFixed(1)),
      sleepQuality: parseFloat((Math.random() * 3 + 6).toFixed(1)),
    })),
  });
  console.log('✅ Health insights created (20)');

  // ── 5. Reminders for first 4 patients ─────────────────────────
  const tomorrow = future(1);
  await prisma.reminder.createMany({
    data: [
      { userId: patients[0].id, title: 'Session Reminder', message: 'Physiotherapy session with Dr. Sarah Al-Rashid', type: 'SESSION', time: `Tomorrow, ${tomorrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, isActive: true },
      { userId: patients[0].id, title: 'Exercise Time', message: 'Daily stretching routine — lower back exercises', type: 'EXERCISE', time: 'Daily, 7:00 PM', isActive: true },
      { userId: patients[0].id, title: 'Medication Time', message: 'Anti-inflammatory medication after meals', type: 'MEDICATION', time: 'Every 6 hours', isActive: true },
      { userId: patients[1].id, title: 'Session Reminder', message: 'Follow-up with Dr. Fatima Al-Zahra', type: 'SESSION', time: 'Tomorrow, 03:00 PM', isActive: true },
      { userId: patients[2].id, title: 'Exercise Time', message: 'Joint mobility exercises', type: 'EXERCISE', time: 'Daily, 8:00 AM', isActive: true },
      { userId: patients[3].id, title: 'Session Reminder', message: 'Session with Dr. Amina Hassan', type: 'SESSION', time: 'In 2 days, 10:00 AM', isActive: true },
    ],
  });
  console.log('✅ Reminders created');

  // ── 6. Slots ────────────────────────────────────────────────────
  // Past slots for completed bookings
  const slotData: any[] = [];
  const doctors = [d1, d2, d3, d4, d5];

  // Each doctor gets slots for past sessions (for analytics) and future sessions (today + upcoming)
  for (const doc of doctors) {
    // Past slots (completed)
    for (let i = 1; i <= 20; i++) {
      slotData.push({ doctorId: doc.doctor!.id, date: past(rand(2, 60)), startTime: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'][rand(0, 5)], endTime: '11:00 AM', isBooked: true });
    }
    // Today's slots (for today's appointments stat)
    for (let i = 0; i < 3; i++) {
      slotData.push({ doctorId: doc.doctor!.id, date: new Date(), startTime: ['9:00 AM', '11:00 AM', '2:30 PM'][i], endTime: ['10:00 AM', '12:00 PM', '3:30 PM'][i], isBooked: true });
    }
    // Future unbooked slots
    for (let i = 1; i <= 6; i++) {
      slotData.push({ doctorId: doc.doctor!.id, date: future(rand(1, 14)), startTime: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'][rand(0, 3)], endTime: '11:00 AM', isBooked: false });
    }
  }

  const createdSlots: any[] = [];
  for (const s of slotData) {
    const slot = await prisma.slot.create({ data: s });
    createdSlots.push(slot);
  }
  console.log(`✅ Slots created (${createdSlots.length})`);

  // ── 7. Bookings ─────────────────────────────────────────────────
  // Map: each patient gets bookings with their primary doctor + sometimes others
  // Primary assignments: patients 0-3 → d1, patients 4-8 → d1 as well (d1 has most patients)
  //                      patients 9-11 → d2, 12-14 → d3, 15-16 → d4, 17-19 → d5
  const doctorForPatient: any[] = [
    d1, d1, d1, d1,   // ahmed, sarah, khalid, layla → d1
    d1, d1, d1, d1, d1, // hassan, noor, faisal, mona, tariq → d1
    d2, d2, d2,        // reem, jaber, hessa → d2
    d3, d3, d3,        // yousef, aisha, salem → d3
    d4, d4,            // fatma, walid → d4
    d5, d5, d5,        // mariam, abdulla, shaikha → d5
  ];

  // Completed past bookings per patient (3–8 each)
  let slotIdx = 0;
  const bookedSlotIds = new Set<string>();

  for (let pi = 0; pi < patients.length; pi++) {
    const patient = patients[pi];
    const primaryDoc = doctorForPatient[pi];
    const numCompleted = rand(3, 8);

    for (let k = 0; k < numCompleted; k++) {
      // Find an unused past slot for this doctor
      const docPastSlots = createdSlots.filter(s =>
        s.doctorId === primaryDoc.doctor!.id &&
        new Date(s.date) < new Date() &&
        !bookedSlotIds.has(s.id)
      );
      if (docPastSlots.length === 0) break;
      const slot = docPastSlots[rand(0, Math.min(docPastSlots.length - 1, 4))];
      bookedSlotIds.add(slot.id);

      const sessionTypes = ['CLINIC', 'HOME_VISIT'] as const;
      const notes = [
        'Lower back pain treatment', 'Core strengthening exercises', 'Spine alignment check',
        'Manual therapy session', 'Mobility improvement exercises', 'Sports injury assessment',
        'Knee rehabilitation', 'Neck pain treatment', 'Neurological assessment', 'Recovery follow-up',
      ];

      await prisma.booking.create({
        data: {
          patientId: patient.id,
          doctorId: primaryDoc.doctor!.id,
          slotId: slot.id,
          status: 'COMPLETED',
          sessionType: sessionTypes[rand(0, 1)],
          notes: notes[rand(0, notes.length - 1)],
          bookedVia: 'APP',
          createdAt: past(rand(1, 60)),
        },
      });
    }
  }

  // Today's appointments for Dr. Sarah (d1) — 3 confirmed for today's stats
  const todaySlots = createdSlots.filter(s =>
    s.doctorId === d1.doctor!.id &&
    new Date(s.date).toDateString() === new Date().toDateString() &&
    !bookedSlotIds.has(s.id)
  );

  const todayPatients = [patients[0], patients[4], patients[5]];
  for (let i = 0; i < Math.min(3, todaySlots.length, todayPatients.length); i++) {
    bookedSlotIds.add(todaySlots[i].id);
    await prisma.booking.create({
      data: {
        patientId: todayPatients[i].id,
        doctorId: d1.doctor!.id,
        slotId: todaySlots[i].id,
        status: i === 0 ? 'CONFIRMED' : i === 1 ? 'PENDING' : 'CONFIRMED',
        sessionType: i === 1 ? 'HOME_VISIT' : 'CLINIC',
        notes: ['Lower back therapy', 'Knee rehabilitation', 'Sports recovery'][i],
        bookedVia: 'APP',
      },
    });
  }

  // Also add today's bookings for d2 (for better analytics variety)
  const todaySlotsD2 = createdSlots.filter(s =>
    s.doctorId === d2.doctor!.id &&
    new Date(s.date).toDateString() === new Date().toDateString() &&
    !bookedSlotIds.has(s.id)
  );
  if (todaySlotsD2.length > 0 && patients[9]) {
    bookedSlotIds.add(todaySlotsD2[0].id);
    await prisma.booking.create({
      data: {
        patientId: patients[9].id, doctorId: d2.doctor!.id,
        slotId: todaySlotsD2[0].id, status: 'CONFIRMED',
        sessionType: 'CLINIC', notes: 'Spine follow-up', bookedVia: 'APP',
      },
    });
  }

  // A few future upcoming bookings
  const futureSlots = createdSlots.filter(s =>
    new Date(s.date) > new Date() && !s.isBooked && !bookedSlotIds.has(s.id)
  );
  const upcomingPairs = [
    [patients[0], d1], [patients[1], d3], [patients[2], d4],
    [patients[3], d5], [patients[9], d2], [patients[12], d3],
  ];
  for (let i = 0; i < Math.min(upcomingPairs.length, futureSlots.length); i++) {
    const [patient, doc] = upcomingPairs[i] as any;
    const fSlot = futureSlots.find(s => s.doctorId === doc.doctor!.id && !bookedSlotIds.has(s.id));
    if (!fSlot) continue;
    bookedSlotIds.add(fSlot.id);
    await prisma.booking.create({
      data: {
        patientId: patient.id, doctorId: doc.doctor!.id,
        slotId: fSlot.id,
        status: i % 2 === 0 ? 'CONFIRMED' : 'PENDING',
        sessionType: i % 3 === 0 ? 'HOME_VISIT' : 'CLINIC',
        notes: 'Upcoming session',
        bookedVia: 'APP',
      },
    });
  }
  console.log('✅ Bookings created (rich dataset)');

  // ── 8. Wallets for ALL patients ────────────────────────────────
  const wallets: any[] = [];
  for (const p of patients) {
    const w = await prisma.wallet.create({
      data: {
        userId: p.id,
        balance: p.balance,
        currency: 'QAR',
        rewards: { create: { points: p.points } },
      },
    });
    wallets.push(w);
  }
  console.log(`✅ Wallets created (${wallets.length})`);

  // ── 9. Payment Methods for first 4 patients ────────────────────
  await prisma.paymentMethod.createMany({
    data: [
      // Ahmed — main account with full payment setup
      { userId: patients[0].id, type: 'CARD', label: 'Primary Visa Card', sublabel: '•••• •••• •••• 4532', last4: '4532', expiry: '12/26', holderName: 'Ahmed Al-Mansouri', provider: 'visa', isDefault: true },
      { userId: patients[0].id, type: 'BANK', label: 'Qatar National Bank', sublabel: 'Account ending in 8901', provider: 'qnb', isVerified: true },
      { userId: patients[0].id, type: 'DIGITAL_WALLET', label: 'Apple Pay', sublabel: 'Touch ID enabled', provider: 'apple' },
      // Sarah
      { userId: patients[1].id, type: 'CARD', label: 'Mastercard', sublabel: '•••• •••• •••• 7891', last4: '7891', expiry: '08/25', holderName: 'Sarah Al-Qassim', provider: 'mastercard', isDefault: true },
      // Khalid
      { userId: patients[2].id, type: 'CARD', label: 'Visa Card', sublabel: '•••• •••• •••• 2211', last4: '2211', expiry: '03/27', holderName: 'Khalid Al-Thani', provider: 'visa', isDefault: true },
      { userId: patients[2].id, type: 'BANK', label: 'Doha Bank', sublabel: 'Account ending in 5544', provider: 'doha', isVerified: true },
      // Layla
      { userId: patients[3].id, type: 'DIGITAL_WALLET', label: 'Apple Pay', sublabel: 'Face ID enabled', provider: 'apple', isDefault: true },
    ],
  });
  console.log('✅ Payment methods created');

  // ── 10. Transactions ───────────────────────────────────────────
  const transactionTemplates = [
    { type: 'DEBIT', category: 'SESSION', title: 'Dr. Sarah Al-Rashid', subtitle: 'Physiotherapy Session', amount: -180 },
    { type: 'CREDIT', category: 'TOP_UP', title: 'Wallet Top-up', subtitle: 'Bank Transfer', amount: 500 },
    { type: 'DEBIT', category: 'HOME_VISIT', title: 'Home Visit Session', subtitle: 'Dr. Omar Khalil', amount: -250 },
    { type: 'CREDIT', category: 'REFERRAL', title: 'Referral Bonus', subtitle: 'Friend joined Physio AI', amount: 50 },
    { type: 'DEBIT', category: 'REHABILITATION', title: 'Rehab Program Payment', subtitle: '4-week package', amount: -720 },
    { type: 'DEBIT', category: 'SESSION', title: 'Dr. Fatima Al-Zahra', subtitle: 'Sports Rehabilitation', amount: -200 },
    { type: 'CREDIT', category: 'TOP_UP', title: 'Wallet Top-up', subtitle: 'Card Payment', amount: 1000 },
    { type: 'DEBIT', category: 'SESSION', title: 'Dr. Ahmed Hassan', subtitle: 'Spine Care Session', amount: -160 },
    { type: 'DEBIT', category: 'HOME_VISIT', title: 'Home Visit', subtitle: 'Dr. Amina Hassan', amount: -200 },
    { type: 'CREDIT', category: 'REFERRAL', title: 'Referral Bonus', subtitle: 'New patient referred', amount: 100 },
  ];

  // Give Ahmed (patient[0]) a rich transaction history
  for (let i = 0; i < transactionTemplates.length; i++) {
    const t = transactionTemplates[i];
    await prisma.transaction.create({
      data: {
        walletId: wallets[0].id,
        type: t.type as any,
        category: t.category as any,
        title: t.title,
        subtitle: t.subtitle,
        amount: t.amount,
        status: 'COMPLETED',
        createdAt: past(i),
      },
    });
  }

  // Give other patients 2-5 transactions each
  for (let pi = 1; pi < Math.min(patients.length, wallets.length); pi++) {
    const numTxn = rand(2, 5);
    for (let t = 0; t < numTxn; t++) {
      const tmpl = transactionTemplates[rand(0, transactionTemplates.length - 1)];
      await prisma.transaction.create({
        data: {
          walletId: wallets[pi].id,
          type: tmpl.type as any,
          category: tmpl.category as any,
          title: tmpl.title,
          subtitle: tmpl.subtitle,
          amount: tmpl.amount,
          status: 'COMPLETED',
          createdAt: past(rand(0, 30)),
        },
      });
    }
  }
  await prisma.promoCode.create({
    data: {
      code: 'FIRST20',
      discountPercent: 20,
      isActive: true,
    },
  });
  console.log('✅ Transactions created (rich dataset)');

  // ── 11. Real email test accounts ──────────────────────────────────
  console.log('🌱 Creating real email test accounts...');

  const realPwd = await bcrypt.hash('Test1234!', 10);

  const realUsers = [
    { email: 'alimarzoug2725@gmail.com', fullName: 'Ali Marzoug', phone: '+974 5557 0001' },
    { email: 'ali.marzoug15@gmail.com', fullName: 'Ali Marzoug Alt', phone: '+974 5557 0002' },
  ];

  for (const ru of realUsers) {
    // Check if already exists (in case seed is re-run partially)
    const existing = await prisma.user.findUnique({ where: { email: ru.email } });
    if (existing) { console.log(`⚠️  ${ru.email} already exists, skipping`); continue; }

    const realUser = await prisma.user.create({
      data: {
        email: ru.email,
        passwordHash: realPwd,
        fullName: ru.fullName,
        role: 'PATIENT',
        phone: ru.phone,
        emailVerified: true,           // ✅ pre-verified so no email needed
        provider: 'email',
        healthProfile: {
          create: {
            age: '26-35', gender: 'male',
            backPain: true, activityLevel: 'Moderate',
          },
        },
      },
    });

    // Wallet with real balance
    const wallet = await prisma.wallet.create({
      data: {
        userId: realUser.id,
        balance: 2500.00,
        currency: 'QAR',
        rewards: { create: { points: 2500 } },
      },
    });

    // Transactions
    const txTemplates = [
      { type: 'CREDIT', category: 'TOP_UP', title: 'Wallet Top-up', subtitle: 'Bank Transfer', amount: 500 },
      { type: 'DEBIT', category: 'SESSION', title: 'Dr. Sarah Al-Rashid', subtitle: 'Physiotherapy Session', amount: -180 },
      { type: 'CREDIT', category: 'TOP_UP', title: 'Wallet Top-up', subtitle: 'Card Payment', amount: 1000 },
      { type: 'DEBIT', category: 'SESSION', title: 'Dr. Ahmed Hassan', subtitle: 'Spine Care Session', amount: -160 },
      { type: 'CREDIT', category: 'REFERRAL', title: 'Referral Bonus', subtitle: 'Friend joined Physio AI', amount: 50 },
      { type: 'DEBIT', category: 'HOME_VISIT', title: 'Home Visit Session', subtitle: 'Dr. Omar Khalil', amount: -250 },
    ];
    for (let i = 0; i < txTemplates.length; i++) {
      const t = txTemplates[i];
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: t.type as any,
          category: t.category as any,
          title: t.title,
          subtitle: t.subtitle,
          amount: t.amount,
          status: 'COMPLETED',
          createdAt: past(i + 1),
        },
      });
    }

    // Payment method
    await prisma.paymentMethod.create({
      data: {
        userId: realUser.id,
        type: 'CARD',
        label: 'Primary Visa Card',
        sublabel: '•••• •••• •••• 4532',
        last4: '4532',
        expiry: '12/26',
        holderName: ru.fullName,
        provider: 'visa',
        isDefault: true,
      },
    });

    // Past bookings (completed sessions)
    const docForBooking = d1.doctor!.id;
    const availablePastSlots = createdSlots.filter(s =>
      s.doctorId === docForBooking &&
      new Date(s.date) < new Date() &&
      !bookedSlotIds.has(s.id)
    ).slice(0, 4);

    for (const slot of availablePastSlots) {
      bookedSlotIds.add(slot.id);
      await prisma.booking.create({
        data: {
          patientId: realUser.id,
          doctorId: docForBooking,
          slotId: slot.id,
          status: 'COMPLETED',
          sessionType: 'CLINIC',
          notes: 'Lower back pain treatment',
          bookedVia: 'APP',
          createdAt: past(rand(5, 30)),
        },
      });
    }

    // One upcoming confirmed booking
    const upcomingSlot = createdSlots.find(s =>
      s.doctorId === docForBooking &&
      new Date(s.date) > new Date() &&
      !s.isBooked &&
      !bookedSlotIds.has(s.id)
    );
    if (upcomingSlot) {
      bookedSlotIds.add(upcomingSlot.id);
      await prisma.booking.create({
        data: {
          patientId: realUser.id,
          doctorId: docForBooking,
          slotId: upcomingSlot.id,
          status: 'CONFIRMED',
          sessionType: 'CLINIC',
          notes: 'Follow-up session',
          bookedVia: 'APP',
        },
      });
    }

    // Health insight
    await prisma.healthInsight.create({
      data: {
        userId: realUser.id,
        heartRate: 72,
        dailySteps: 8547,
        exerciseSessions: 5,
        totalSessions: 5,
        painLevel: 2.1,
        sleepQuality: 8.3,
      },
    });

    console.log(`✅ Real account created: ${ru.email} / Test1234!`);
  }

  // ── Summary ────────────────────────────────────────────────────
  console.log('');
  console.log('🎉 Rich seed complete!');
  console.log('');
  console.log('👤 Main patient accounts:');
  console.log('  ahmed@physioai.qa    / patient123  — balance: QAR 2,450  (10 transactions)');
  console.log('  sarah@physioai.qa    / patient123  — balance: QAR 800');
  console.log('  khalid@physioai.qa   / patient123  — balance: QAR 1,200');
  console.log('  layla@physioai.qa    / patient123  — balance: QAR 650');
  console.log('');
  console.log('👥 Extra patients (patient123 for all):');
  console.log('  hassan, noor, faisal, mona, tariq → Dr. Sarah (many bookings)');
  console.log('  reem, jaber, hessa               → Dr. Ahmed');
  console.log('  yousef, aisha, salem             → Dr. Fatima');
  console.log('  fatma, walid                     → Dr. Omar');
  console.log('  mariam, abdulla, shaikha         → Dr. Amina');
  console.log('');
  console.log('👨‍⚕️ Doctor accounts (doctor123 for all):');
  console.log('  dr.sarah@physioai.qa   — rating 4.9 — QAR 180/session — 9 patients');
  console.log('  dr.ahmed@physioai.qa   — rating 4.7 — QAR 160/session — 3 patients');
  console.log('  dr.fatima@physioai.qa  — rating 4.8 — QAR 200/session — 3 patients');
  console.log('  dr.omar@physioai.qa    — rating 4.9 — QAR 220/session — 2 patients');
  console.log('  dr.amina@physioai.qa   — rating 4.6 — QAR 150/session — 3 patients');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());