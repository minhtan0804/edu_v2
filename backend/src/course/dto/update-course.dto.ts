import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateCourseDto {
  @ApiProperty({
    description: "Course title",
    example: "Introduction to Healthcare",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Course slug (URL-friendly)",
    example: "introduction-to-healthcare",
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: "Course description",
    example: "Learn the basics of healthcare...",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Course thumbnail URL",
    example: "https://example.com/thumbnail.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: "Course price",
    example: 99.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: "Category ID",
    example: "clxxx",
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
