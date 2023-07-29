import { IsEmail, IsNotEmpty, MinLength, NotContains, ValidateIf } from 'class-validator';

export class RegisterDto {
    @NotContains('@')
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'username should not be empty' })
    usernameOrEmail: string;

    @IsNotEmpty()
    password: string;
}
