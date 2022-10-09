import { ApiProperty } from '@nestjs/swagger';

export class UpdateSuccessDto {
  @ApiProperty({ type: 'boolean', description: '업데이트 성공 여부' })
  success: boolean;
}
