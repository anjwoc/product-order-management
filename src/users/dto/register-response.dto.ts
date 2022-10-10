import { OmitType } from '@nestjs/swagger';
import { User } from '../user.entity';
import { UserRegisterDto } from './user-register.dto';

export class RegisterResponseDto extends OmitType(User, [
  'id',
  'orders',
  'createdAt',
  'deletedAt',
  'password',
]) {
  constructor(requestDto: UserRegisterDto) {
    super();
    const { email, username, phoneNumber, isAdmin } = requestDto;
    this.email = email;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.isAdmin = isAdmin;
  }
}
