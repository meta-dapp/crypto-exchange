import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 12);
    }
}