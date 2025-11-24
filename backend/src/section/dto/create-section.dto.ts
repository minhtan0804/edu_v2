import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateSectionDto {
  @ApiProperty({
    description: "Section title",
    example: "Introduction",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Section position in course",
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({
    description: "Course ID",
    example: "clxxx",
  })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}
