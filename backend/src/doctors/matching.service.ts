import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// ── Symptom → Specialty mapping ───────────────────────────────────
// Maps patient symptoms to required doctor specialties with weights
const SYMPTOM_SPECIALTY_MAP: Record<string, string[]> = {
  // Back issues
  backPain: ['Musculoskeletal', 'Orthopedic', 'Sports', 'Rehabilitation'],
  chronicPain: ['Musculoskeletal', 'Pain Management', 'Rehabilitation'],
  postSurgery: ['Rehabilitation', 'Orthopedic', 'Musculoskeletal'],

  // Joint issues
  jointPain: ['Orthopedic', 'Musculoskeletal', 'Sports', 'Rheumatology'],

  // Sports
  sportsInjury: ['Sports', 'Orthopedic', 'Musculoskeletal', 'Rehabilitation'],

  // Neck / neurological
  neckIssues: ['Neurological', 'Musculoskeletal', 'Orthopedic'],
  neurologicalIssues: ['Neurological', 'Rehabilitation'],

  // Respiratory
  respiratoryIssues: ['Respiratory', 'Cardiopulmonary'],
};

// ── Scoring weights (must sum to 100) ────────────────────────────
const WEIGHTS = {
  specialty: 35,   // specialty matches patient symptoms
  availability: 20,   // has open slots this week
  rating: 20,   // doctor rating (0–5)
  price: 10,   // within patient budget
  language: 5,   // speaks patient's preferred language
  experience: 5,   // years of experience
  gender: 5,   // preferred doctor gender
};

export interface MatchedDoctor {
  id: string;
  fullName: string;
  specialty: string;
  specialties: string[];
  rating: number;
  pricePerSession: number;
  experience: string;
  centerName: string;
  centerCity: string;
  avatarUrl: string;
  isAvailable: boolean;
  languages: string[];
  matchScore: number;
  matchReasons: string[];
  scoreBreakdown: {
    specialty: number;
    availability: number;
    rating: number;
    price: number;
    language: number;
    experience: number;
    gender: number;
  };
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(private prisma: PrismaService) { }

  // ── Main matching method ──────────────────────────────────────
  // async getRecommendedDoctors(
  //   userId: string,
  //   limit: number = 10,
  // ): Promise<MatchedDoctor[]> {

  //   // 1. Load patient health profile
  //   const profile = await this.prisma.healthProfile.findUnique({
  //     where: { userId },
  //   });

  //   // 2. Load all available doctors with their slots
  //   const today = new Date();
  //   const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  //   const doctors = await this.prisma.doctor.findMany({
  //     where: { isAvailable: true },
  //     include: {
  //       user: true,
  //       center: true,
  //       slots: {
  //         where: {
  //           date: { gte: today, lte: nextWeek },
  //           isBooked: false,
  //         },
  //       },
  //     },
  //   });

  //   if (doctors.length === 0) return [];

  //   // 3. Get required specialties from patient profile
  //   const requiredSpecialties = this.getRequiredSpecialties(profile);
  //   this.logger.log(
  //     `Matching for user ${userId} — required specialties: ${requiredSpecialties.join(', ')}`,
  //   );

  //   // 4. Score each doctor
  //   const scored = doctors.map(doctor => {
  //     const breakdown = {
  //       specialty: this.scoreSpecialty(doctor.specialties, requiredSpecialties),
  //       availability: this.scoreAvailability(doctor.slots.length),
  //       rating: this.scoreRating(doctor.rating ?? 0),
  //       price: this.scorePrice(doctor.pricePerSession ?? 0, profile?.maxBudget ?? null),
  //       language: this.scoreLanguage(doctor.languages ?? ['en'], profile?.preferredLanguage ?? 'en'),
  //       experience: this.scoreExperience(doctor.yearsExperience ?? 0),
  //       gender: 100,
  //     };

  //     // Weighted total score
  //     const total = Math.round(
  //       (breakdown.specialty * WEIGHTS.specialty / 100) +
  //       (breakdown.availability * WEIGHTS.availability / 100) +
  //       (breakdown.rating * WEIGHTS.rating / 100) +
  //       (breakdown.price * WEIGHTS.price / 100) +
  //       (breakdown.language * WEIGHTS.language / 100) +
  //       (breakdown.experience * WEIGHTS.experience / 100) +
  //       (breakdown.gender * WEIGHTS.gender / 100),
  //     );

  //     const matchReasons = this.buildMatchReasons(breakdown, doctor, requiredSpecialties);

  //     const avatarUrl = doctor.user.avatarUrl ||
  //       `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`;

  //     return {
  //       id: doctor.id,
  //       fullName: doctor.user.fullName,
  //       specialty: doctor.specialties[0] ?? 'General Physiotherapy',
  //       specialties: doctor.specialties,
  //       rating: doctor.rating ?? 0,
  //       pricePerSession: doctor.pricePerSession ?? 0,
  //       experience: `${doctor.yearsExperience ?? 0} years`,
  //       centerName: doctor.center?.name ?? '',
  //       centerCity: doctor.center?.city ?? '',
  //       avatarUrl,
  //       isAvailable: doctor.isAvailable,
  //       languages: doctor.languages ?? ['en'],
  //       matchScore: total,
  //       matchReasons,
  //       scoreBreakdown: breakdown,
  //     };
  //   });

  //   // 5. Sort by match score descending
  //   scored.sort((a, b) => b.matchScore - a.matchScore);

  //   return scored.slice(0, limit);
  // }

  // In matching.service.ts
  async getRecommendedDoctors(userId: string, limit = 10) {
    const profile = await this.prisma.healthProfile.findUnique({
      where: { userId },
    });

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const doctors = await this.prisma.doctor.findMany({
      where: { isAvailable: true },
      include: {
        user: true,
        center: true,
        slots: {
          where: {
            date: { gte: today, lte: nextWeek },
            isBooked: false,
          },
        },
      },
      // ✅ If no profile, just return top-rated doctors
      orderBy: { rating: 'desc' },
      take: limit * 2, // get more to score and filter
    });

    if (doctors.length === 0) return [];

    const requiredSpecialties = this.getRequiredSpecialties(profile);

    const scored = doctors.map(doctor => {
      // ✅ If no profile — give everyone a base score from rating + availability
      const baseScore = profile ? 0 : 50;

      const breakdown = {
        specialty: profile ? this.scoreSpecialty(doctor.specialties, requiredSpecialties) : 50,
        availability: this.scoreAvailability(doctor.slots.length),
        rating: this.scoreRating(doctor.rating ?? 0),
        price: this.scorePrice(doctor.pricePerSession ?? 0, profile?.maxBudget ?? null),
        language: this.scoreLanguage(doctor.languages ?? ['en'], profile?.preferredLanguage ?? 'en'),
        experience: this.scoreExperience(doctor.yearsExperience ?? 0),
        gender: this.scoreGender(doctor.user.gender ?? 'male', profile?.preferredGender ?? 'any'),
      };

      const total = profile
        ? Math.round(
          (breakdown.specialty * WEIGHTS.specialty / 100) +
          (breakdown.availability * WEIGHTS.availability / 100) +
          (breakdown.rating * WEIGHTS.rating / 100) +
          (breakdown.price * WEIGHTS.price / 100) +
          (breakdown.language * WEIGHTS.language / 100) +
          (breakdown.experience * WEIGHTS.experience / 100) +
          (breakdown.gender * WEIGHTS.gender / 100),
        )
        // ✅ No profile: score = rating (40%) + availability (40%) + base (20%)
        : Math.round(
          baseScore +
          (breakdown.rating * 0.4) +
          (breakdown.availability * 0.4),
        );

      const matchReasons = profile
        ? this.buildMatchReasons(breakdown, doctor, requiredSpecialties)
        : [
          doctor.rating && doctor.rating >= 4 ? `Rated ${doctor.rating.toFixed(1)}/5` : null,
          doctor.slots.length > 0 ? 'Available this week' : null,
          doctor.specialties[0] ?? null,
        ].filter(Boolean) as string[];

      return {
        id: doctor.id,
        fullName: doctor.user.fullName,
        specialty: doctor.specialties[0] ?? 'General Physiotherapy',
        specialties: doctor.specialties,
        rating: doctor.rating ?? 0,
        pricePerSession: doctor.pricePerSession ?? 0,
        experience: `${doctor.yearsExperience ?? 0} years`,
        centerName: doctor.center?.name ?? '',
        centerCity: doctor.center?.city ?? '',
        avatarUrl: doctor.user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user.fullName)}&background=3b82f6&color=fff&size=128`,
        isAvailable: doctor.isAvailable,
        languages: doctor.languages ?? ['en'],
        matchScore: Math.min(100, Math.max(0, total)),
        matchReasons,
        scoreBreakdown: breakdown,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
  }

  // ── Specialty scoring ─────────────────────────────────────────
  private scoreSpecialty(
    doctorSpecialties: string[],
    required: string[],
  ): number {
    if (!required.length) return 50; // no profile = neutral score

    const lower = doctorSpecialties.map(s => s.toLowerCase());

    let bestScore = 0;
    required.forEach((req, index) => {
      const reqLower = req.toLowerCase();

      // Exact match = full score
      if (lower.some(s => s === reqLower)) {
        const positionBonus = Math.max(0, 30 - index * 5); // higher bonus for primary specialty
        bestScore = Math.max(bestScore, 100 - index * 10 + positionBonus);
        return;
      }

      // Partial match (e.g. "Sports" in "Sports Physiotherapy")
      if (lower.some(s => s.includes(reqLower) || reqLower.includes(s))) {
        bestScore = Math.max(bestScore, 70 - index * 10);
        return;
      }
    });

    return Math.min(100, Math.max(0, bestScore));
  }

  // ── Availability scoring ──────────────────────────────────────
  private scoreAvailability(openSlotsThisWeek: number): number {
    if (openSlotsThisWeek === 0) return 0;
    if (openSlotsThisWeek >= 10) return 100;
    if (openSlotsThisWeek >= 5) return 80;
    if (openSlotsThisWeek >= 3) return 60;
    if (openSlotsThisWeek >= 1) return 40;
    return 0;
  }

  // ── Rating scoring ────────────────────────────────────────────
  private scoreRating(rating: number): number {
    // rating is 0–5, convert to 0–100
    return Math.round((rating / 5) * 100);
  }

  // ── Price scoring ─────────────────────────────────────────────
  private scorePrice(price: number, budget: number | null): number {
    if (!budget) return 70; // no budget preference = neutral
    if (price <= budget * 0.7) return 100;  // well within budget
    if (price <= budget) return 80;   // within budget
    if (price <= budget * 1.1) return 50;   // slightly over
    if (price <= budget * 1.3) return 20;   // over budget
    return 0;                               // way over budget
  }

  // ── Language scoring ──────────────────────────────────────────
  private scoreLanguage(
    doctorLanguages: string[],
    preferred: string,
  ): number {
    const lower = doctorLanguages.map(l => l.toLowerCase());
    if (lower.includes(preferred.toLowerCase())) return 100;
    if (lower.includes('en')) return 50; // English as fallback
    return 0;
  }

  // ── Experience scoring ────────────────────────────────────────
  private scoreExperience(years: number): number {
    if (years >= 15) return 100;
    if (years >= 10) return 85;
    if (years >= 5) return 70;
    if (years >= 3) return 55;
    if (years >= 1) return 40;
    return 20;
  }

  // ── Gender preference scoring ─────────────────────────────────
  private scoreGender(
    doctorGender: string,
    preferred: string,
  ): number {
    if (preferred === 'any') return 100;
    if (preferred.toLowerCase() === doctorGender.toLowerCase()) return 100;
    return 0;
  }

  // ── Build human-readable match reasons ───────────────────────
  private buildMatchReasons(
    breakdown: Record<string, number>,
    doctor: any,
    requiredSpecialties: string[],
  ): string[] {
    const reasons: string[] = [];

    if (breakdown.specialty >= 80) {
      const match = requiredSpecialties[0];
      reasons.push(`Specializes in ${match || doctor.specialties[0]}`);
    }
    if (breakdown.availability >= 60) {
      reasons.push('Available this week');
    }
    if (breakdown.rating >= 80) {
      reasons.push(`Highly rated (${doctor.rating?.toFixed(1) ?? 'N/A'}/5)`);
    }
    if (breakdown.price >= 80) {
      reasons.push('Within your budget');
    }
    if (breakdown.language === 100) {
      reasons.push('Speaks your language');
    }
    if (breakdown.experience >= 70) {
      reasons.push(`${doctor.yearsExperience}+ years experience`);
    }

    // Fallback
    if (reasons.length === 0) {
      reasons.push('Qualified physiotherapist');
    }

    return reasons;
  }

  // ── Build required specialties from health profile ────────────
  private getRequiredSpecialties(profile: any): string[] {
    if (!profile) return [];

    const specialties = new Set<string>();

    if (profile.backPain) SYMPTOM_SPECIALTY_MAP.backPain.forEach(s => specialties.add(s));
    if (profile.jointPain) SYMPTOM_SPECIALTY_MAP.jointPain.forEach(s => specialties.add(s));
    if (profile.sportsInjury) SYMPTOM_SPECIALTY_MAP.sportsInjury.forEach(s => specialties.add(s));
    if (profile.neckIssues) SYMPTOM_SPECIALTY_MAP.neckIssues.forEach(s => specialties.add(s));
    if (profile.chronicPain) SYMPTOM_SPECIALTY_MAP.chronicPain.forEach(s => specialties.add(s));
    if (profile.postSurgery) SYMPTOM_SPECIALTY_MAP.postSurgery.forEach(s => specialties.add(s));
    if (profile.neurologicalIssues) SYMPTOM_SPECIALTY_MAP.neurologicalIssues.forEach(s => specialties.add(s));
    if (profile.respiratoryIssues) SYMPTOM_SPECIALTY_MAP.respiratoryIssues.forEach(s => specialties.add(s));

    // Primary symptom text match (from AI chat extraction)
    if (profile.primarySymptom) {
      const sym = profile.primarySymptom.toLowerCase();
      if (sym.includes('back')) SYMPTOM_SPECIALTY_MAP.backPain.forEach(s => specialties.add(s));
      if (sym.includes('neck')) SYMPTOM_SPECIALTY_MAP.neckIssues.forEach(s => specialties.add(s));
      if (sym.includes('knee') || sym.includes('joint')) SYMPTOM_SPECIALTY_MAP.jointPain.forEach(s => specialties.add(s));
      if (sym.includes('sport')) SYMPTOM_SPECIALTY_MAP.sportsInjury.forEach(s => specialties.add(s));
      if (sym.includes('breath')) SYMPTOM_SPECIALTY_MAP.respiratoryIssues.forEach(s => specialties.add(s));
    }

    return [...specialties];
  }

  // ── Score a single doctor for a text query (used by AI chat) ─
  async scoreForQuery(doctorId: string, symptoms: string[]): Promise<number> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { slots: { where: { isBooked: false } } },
    });

    if (!doctor) return 0;

    const specialties = doctor.specialties.map(s => s.toLowerCase());
    const symLower = symptoms.map(s => s.toLowerCase());

    let score = 0;
    symLower.forEach(sym => {
      if (specialties.some(s => s.includes(sym) || sym.includes(s))) {
        score += 30;
      }
    });

    // Boost for availability and rating
    score += doctor.slots.length > 0 ? 20 : 0;
    score += Math.round(((doctor.rating ?? 0) / 5) * 20);

    return Math.min(100, score);
  }
}