import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Transaction } from '../../transaction/schemas/transaction.schema';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
    @Prop({
        required: false,
        default: 0
    })
    balance: number;

    @Prop({
        required: true,
        index: true,
    })
    address: string;

    @Prop()
    coin: string;

    @Prop()
    chainId: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
    transactions: [Transaction];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet); 