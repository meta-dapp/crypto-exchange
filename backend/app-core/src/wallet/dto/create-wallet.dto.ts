import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsLowercase,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';

export class CreateWalletDto {
    @IsString()
    @Transform((coin) => coin.value.toUpperCase())
    coin: string;

    @IsNumber()
    chainId: number;

    @IsOptional()
    @IsString()
    @IsEmail()
    @IsLowercase()
    email: string;
}
