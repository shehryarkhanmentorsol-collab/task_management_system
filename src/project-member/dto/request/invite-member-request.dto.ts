import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '../../../project/enums/member.enums';

export class InviteMemberRequestDto {
  @ApiProperty({ example: 'user-uuid-here' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({ enum: MemberRole, default: MemberRole.MEMBER })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;
}