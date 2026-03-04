import { IsOptional, IsString } from 'class-validator';

export class GetUserRequestDto {
  @IsOptional()
  @IsString()
  id?: string;
}
