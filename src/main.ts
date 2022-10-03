import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

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
    this.setupSwaggerModule();

    this.app.use(cookieParser);

    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
    this.app.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.app.get(Reflector)),
    );

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
  new Logger('init').error(err);
});
