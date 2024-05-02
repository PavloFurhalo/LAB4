import { IsString, IsNotEmpty, IsIn } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsIn(["standard", "lite", "universal"])
  type: string;
}
