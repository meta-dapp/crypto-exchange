import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    UserModule
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    UserService
  ]
})
export class WalletModule { }
