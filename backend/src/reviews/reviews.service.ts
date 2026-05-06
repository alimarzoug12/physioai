import {
  Injectable, BadRequestException, NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) { }

  async createReview(patientId: string, dto: CreateReviewDto) {
    // 1. Validate rating range
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // 2. Find the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { review: true },
    });

    console.log('Review attempt:', {
      bookingId: dto.bookingId,
      patientId,
      bookingPatientId: booking?.patientId,
      bookingStatus: booking?.status,
      hasReview: !!booking?.review,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // 3. Must be the patient's own booking
    if (booking.patientId !== patientId) {
      throw new ForbiddenException('You can only review your own sessions');
    }

    // 4. Session must be completed
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException(
        'You can only review completed sessions',
      );
    }

    // 5. Prevent duplicate review
    if (booking.review) {
      throw new BadRequestException(
        'You have already reviewed this session',
      );
    }

    // 6. Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        patientId,
        doctorId: booking.doctorId,
        rating: dto.rating,
        comment: dto.comment?.trim() || null,
      },
    });

    // 7. Recalculate and update doctor's average rating
    await this.updateDoctorRating(booking.doctorId);

    return {
      success: true,
      reviewId: review.id,
      message: 'Thank you for your review!',
    };
  }

  private async updateDoctorRating(doctorId: string) {
    const result = await this.prisma.review.aggregate({
      where: { doctorId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avg = result._avg.rating ?? 0;

    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: { rating: Math.round(avg * 10) / 10 },
    });
  }

  async getDoctorReviews(
    doctorId: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { doctorId },
        include: {
          patient: {
            select: { fullName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { doctorId } }),
    ]);

    // Rating breakdown (1–5 star counts)
    const breakdown = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { doctorId },
      _count: true,
    });

    const starCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    breakdown.forEach(b => {
      starCounts[Math.round(b.rating)] = b._count;
    });

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { rating: true },
    });

    return {
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        patientName: r.patient.fullName,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        averageRating: doctor?.rating ?? 0,
        totalReviews: total,
        starCounts,
      },
    };
  }

  async canReview(patientId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking || booking.patientId !== patientId) {
      return { canReview: false, reason: 'Booking not found' };
    }
    if (booking.status !== 'COMPLETED') {
      return { canReview: false, reason: 'Session not completed yet' };
    }
    if (booking.review) {
      return { canReview: false, reason: 'Already reviewed', reviewId: booking.review.id };
    }

    return { canReview: true };
  }
}