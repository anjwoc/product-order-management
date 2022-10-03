import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidation } from './validations/config.validation';
import { typeOrmModuleConfig } from './config/typeorm';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { UsersController } from './users/users.controller';
import { OrdersController } from './orders/orders.controller';
import { UsersService } from './users/users.service';
import { OrdersService } from './orders/orders.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleConfig),
    UsersModule,
    OrdersModule,
    ProductsModule,
    PaymentsModule,
  ],
  controllers: [
    AppController,
    // UsersController,
    // OrdersController,
    // ProductsController,
  ],
  providers: [AppService],
})
export class AppModule {}
