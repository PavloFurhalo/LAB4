import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from '@nestjs/class-validator';

export class UserDto {

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
