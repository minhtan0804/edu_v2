import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class VerifyInstructorDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isVerified: boolean;
}

