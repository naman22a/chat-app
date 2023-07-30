import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, NotContains, ValidateIf } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'test__123',
        description: 'The username of the user.This should not contain @ symbol.',
        required: true,
    })
    @NotContains('@')
    @MinLength(3)
    username: string;

    @ApiProperty({
        example: 'test@test.com',
        description: 'The email address of the user',
        required: true,
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Passwdtest123',
        description: 'The password of the user',
        minLength: 6,
        required: true,
    })
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({
        example: 'Username: test__123 or Email: test@test.com',
        description: 'The username or email of the user',
        required: true,
    })
    @IsNotEmpty({ message: 'username should not be empty' })
    usernameOrEmail: string;

    @ApiProperty({
        example: 'Passwdtest123',
        description: 'The password of the user',
        required: true,
    })
    @IsNotEmpty()
    password: string;
}
