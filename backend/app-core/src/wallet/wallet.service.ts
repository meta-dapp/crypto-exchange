import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class WalletService {
  create(createWalletDto: CreateWalletDto) {
    return 'This action adds a new wallet';
  }
}