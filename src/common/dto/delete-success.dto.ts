import { ApiProperty } from '@nestjs/swagger';

export class DeleteSuccessDto {
  @ApiProperty({ type: 'boolean', description: '삭제 성공 여부' })
  deleted: boolean;

  constructor(deleted: boolean) {
    this.deleted = deleted;
  }
}
