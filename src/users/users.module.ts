import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { UsersConsumer } from './users.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, UsersConsumer],
})
export class UsersModule {}
