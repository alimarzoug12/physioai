import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // adjust path to your guard

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  getWallet(@Req() req: any) {
    return this.walletService.getWallet(req.user.userId);
  }

  @Get('payment-methods')
  getPaymentMethods(@Req() req: any) {
    return this.walletService.getPaymentMethods(req.user.userId);
  }

  @Get('transactions')
  getTransactions(@Req() req: any) {
    return this.walletService.getTransactions(req.user.userId);
  }

  @Get('spending')
  getSpending(@Req() req: any) {
    return this.walletService.getMonthlySpending(req.user.userId);
  }
}