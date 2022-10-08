import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidation } from './validations/config.validation';
import { typeOrmModuleConfig } from './config/typeorm';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidation,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT as unknown as number,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleConfig),
    UsersModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
