import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AvatarClass{
  @IsOptional()
  @IsString()
  url?: string

  @IsOptional()
  @IsString()
  publicId?: string
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsArray()
  @IsString({each: true})
  links!: string[]

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AvatarClass)
  avatar!: AvatarClass;
}
