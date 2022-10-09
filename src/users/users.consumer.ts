import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('user')
export class UsersConsumer {
  private readonly logger = new Logger(UsersConsumer.name);

  printLoginedUser(token, user) {
    this.logger.debug('==================[LOGIN INFO]==================');
    console.table([{ jwt: token }]);
    console.table(user);
    this.logger.debug('================================================');
  }

  printRegisteredUser(user) {
    this.logger.debug('==================[USER INFO]==================');
    console.table(user);
    this.logger.debug('================================================');
  }

  @Process('register')
  afterRegister(job: Job) {
    this.printRegisteredUser(job.data);
  }

  @Process('login')
  afterLogin(job: Job) {
    const { jwt, user } = job.data;
    this.printLoginedUser(jwt, user);
  }
}
