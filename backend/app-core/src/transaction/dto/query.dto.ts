import { Transform } from 'class-transformer';
import {
    IsMongoId,
    IsOptional,
    IsString
} from 'class-validator';

export class QueryDto {
    @IsOptional()
    @IsString()
    @Transform((coin) => coin.value.toUpperCase())
    coin: string;

    @IsOptional()
    @IsString()
    @IsMongoId()
    transactionId: string;
}
