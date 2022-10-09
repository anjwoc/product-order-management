import { ApiProperty } from '@nestjs/swagger';

export class CreateSuccessDto {
  @ApiProperty({ type: 'boolean', description: '생성 성공 여부' })
  success: boolean;
}
