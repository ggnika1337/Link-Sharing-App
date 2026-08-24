import { IsEmail, IsObject, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  avatar!: string;

  @IsString()
  fullName!: string;

  @IsString()
  password!: string;

  @IsEmail()
  email!: string;

  @IsObject()
  links!: object;
}
