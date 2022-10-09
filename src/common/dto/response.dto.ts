import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ type: Boolean })
  readonly success: boolean;
  @ApiProperty({ isArray: true })
  readonly data: T[];

  constructor(success: boolean, data: T[]) {
    this.success = success;
    this.data = data;
  }
}
