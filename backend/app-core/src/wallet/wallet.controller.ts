import { Controller, Get, Post, Body, Request, UseGuards, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { QueryDto } from './dto/query.dto';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';
import { WithdrawDto } from './dto/withdraw.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  createWallet(
    @Request() req,
    @Body() createWalletDto: CreateWalletDto
  ) {
    createWalletDto.email = req.user.email;
    return this.walletService.create(createWalletDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('info')
  wallet(
    @Request() req,
    @Query() queryDto: QueryDto
  ) {
    return this.walletService.getWallet(
      req.user.email,
      queryDto
    )
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  wallets(@Request() req) {
    return this.walletService.getWallets(req.user.email);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('withdraw')
  withdraw(
    @Request() req,
    @Body() withdrawDto: WithdrawDto
  ) {
    withdrawDto.email = req.user.email;
    return this.walletService.withdraw(withdrawDto);
  }
}
