import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';

export class UserPaginationDto extends PageOptionsDto {
  @ApiProperty({ type: 'boolean', description: '관리자 여부', required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
