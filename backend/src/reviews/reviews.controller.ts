import {
  Controller, Post, Get, Body, Param,
  Req, UseGuards, Query, ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // POST /reviews
  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  createReview(@Req() req: any, @Body() dto: CreateReviewDto) {
    console.log('Review DTO received:', dto);        // ✅ add this
    console.log('Patient ID:', req.user.userId);
    return this.reviewsService.createReview(req.user.userId, dto);
  }

  // GET /doctors/:id/reviews?page=1&limit=10
  @Get('doctors/:id/reviews')
  getDoctorReviews(
    @Param('id') doctorId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewsService.getDoctorReviews(doctorId, page, limit);
  }

  // GET /reviews/can-review/:bookingId — check before showing review button
  @Get('reviews/can-review/:bookingId')
  @UseGuards(JwtAuthGuard)
  canReview(@Param('bookingId') bookingId: string, @Req() req: any) {
    return this.reviewsService.canReview(req.user.userId, bookingId);
  }
}