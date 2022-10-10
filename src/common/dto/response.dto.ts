import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ type: Boolean, description: '성공 여부' })
  readonly success: boolean;
  @ApiProperty({ isArray: true, description: '결과 데이터' })
  readonly data: T[];

  constructor(success: boolean, data: T[]) {
    this.success = success;
    this.data = data;
  }
}
