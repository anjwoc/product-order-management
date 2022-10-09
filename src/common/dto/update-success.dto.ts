import { ApiProperty } from '@nestjs/swagger';

export class UpdateSuccessDto {
  @ApiProperty({ type: 'boolean', description: '수정 성공 여부' })
  success: boolean;
}
