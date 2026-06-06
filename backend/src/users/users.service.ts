import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                avatarUrl: true,
                gender: true,
                emailVerified: true,
                provider: true,
                createdAt: true,
                healthProfile: true,
            },
        });
    }

    async updateProfile(userId: string, data: {
        fullName?: string;
        phone?: string;
        dateOfBirth?: string;
        gender?: string;
        location?: string;
    }) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: data.fullName,
                phone: data.phone,
            },
        });
    }

    async updateHealthProfile(userId: string, data: {
        conditions?: string;
        medications?: string;
        allergies?: string;
        activityLevel?: string;
    }) {
        const existing = await this.prisma.healthProfile.findUnique({
            where: { userId },
        });

        if (existing) {
            return this.prisma.healthProfile.update({
                where: { userId },
                data: {
                    activityLevel: data.activityLevel,
                },
            });
        } else {
            return this.prisma.healthProfile.create({
                data: {
                    userId,
                    activityLevel: data.activityLevel,
                },
            });
        }
    }
}