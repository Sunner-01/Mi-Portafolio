import { IsEmail, IsString, Length } from 'class-validator';

export class ContactDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(10, 2000)
  message!: string;
}
