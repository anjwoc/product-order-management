import { JwtPayloadDto } from './jwt.payload.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractToken } from 'src/common/utils/utility';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractToken]),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadDto) {
    try {
      const user = await this.usersService.findUserById(
        payload.sub as unknown as number,
      );
      if (!user) {
        throw new Error('해당하는 유저가 없습니다.');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
