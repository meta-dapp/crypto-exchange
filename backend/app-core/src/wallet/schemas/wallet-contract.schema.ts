import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletContractDocument = WalletContract & Document;

@Schema()
export class WalletContract {
    @Prop({
        required: true,
        index: true,
    })
    address: string;

    @Prop({
        index: true,
        default: false
    })
    reserved: boolean;

    @Prop()
    chainId: number;
}

export const WalletContractSchema = SchemaFactory.createForClass(WalletContract); 