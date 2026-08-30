import { IsArray, IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

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
  @IsString()
  avatar!: string;
}
