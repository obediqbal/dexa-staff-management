import { IsEmail, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateStaffDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsDateString()
    hireDate?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
