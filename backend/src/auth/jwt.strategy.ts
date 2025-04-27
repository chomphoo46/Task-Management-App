import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
interface JwtPayload {
  sub: string; // หรือ number ขึ้นกับระบบคุณ
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'supersecretkey', // ใช้ ENV จริงๆ
    });
  }

  validate(payload: JwtPayload): Promise<{ sub: string }> {
    return Promise.resolve({ sub: payload.sub });
  }
}
