import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';

export class UserPaginationDto extends PageOptionsDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;
}
