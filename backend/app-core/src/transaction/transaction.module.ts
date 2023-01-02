import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Wallet, WalletSchema } from '../wallet/schemas/wallet.schema';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
    ])
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    AuthService,
    UserService,
    HashService
  ]
})
export class TransactionModule { }
