import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';
import { Transform, plainToClass, Type } from 'class-transformer';

export class LinksDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  originalLink: string;
}
// export class QueryExpiredAtDto {
//   @ApiProperty({ type: String })
//  @IsDate()
//  @IsOptional()
//  @Type(() => Date)
//   gt?: Date;

//   @ApiProperty({ type: String })
//  @IsDate()
//  @IsOptional()
//  @Type(() => Date)
//   lt?: Date;
// }
// export class QueryDto {
//   @ApiProperty({ type: String })
//   @IsNotEmpty()
//   @Transform(({ value }) => plainToClass(QueryExpiredAtDto, JSON.parse(value)))
//   @IsOptional()
//   expiredAt?: QueryExpiredAtDto;
// }