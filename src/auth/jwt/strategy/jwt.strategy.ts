import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // do not allow expired tokens
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // TODO: implement this i guess
    return { userId: payload.sub, username: payload.username };
  }
}
