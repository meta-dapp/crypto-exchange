import { PassportSerializer } from "@nestjs/passport";

export class SessionSerializer extends PassportSerializer {
    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        done(null, {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })
    }

    deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {
        done(null, payload)
    }
}