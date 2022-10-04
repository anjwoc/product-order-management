import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

class Application {
  private logger = new Logger(Application.name);
  private prod: boolean;
  private port: string;

  constructor(private app: NestExpressApplication) {
    this.app = app;

    this.prod = process.env.NODE_ENV === 'production';
    this.port = process.env.PORT;
  }

  private setupSwaggerModule = () => {
    const config = new DocumentBuilder()
      .setTitle('Product Order Management System')
      .setDescription('[Nestjs - TypeORM - Postgresql]')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  };

  private async setupMiddleWare() {
    // cookie parser
    this.app.use(cookieParser());
    this.app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
        },
      }),
    );

    // swagger module
    this.setupSwaggerModule();

    // global pipe, filter, interceptor
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
    this.app.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.app.get(Reflector)),
    );
    this.app.useGlobalFilters(new HttpExceptionFilter());

    // passport 설정
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  async bootstrap() {
    await this.setupMiddleWare();

    await this.app.listen(this.port);
    this.logger.log(`Server is listening on port ${this.port}`);
  }
}

async function initialize(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.bootstrap();
}

initialize().catch((err) => {
  console.error(err);
});
