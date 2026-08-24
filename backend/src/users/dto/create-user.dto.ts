import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  avatar!: string;

  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsObject()
  links!: object;
}
