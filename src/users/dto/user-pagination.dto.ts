import { PageOptionsDto } from 'src/common/dto/pagination-options.dto';

export class UserPaginationDto extends PageOptionsDto {
  isAdmin: boolean;
}
