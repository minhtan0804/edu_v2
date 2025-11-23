import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateCourseDto {
  @ApiProperty({
    description: "Course title",
    example: "Introduction to Healthcare",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Course slug (URL-friendly)",
    example: "introduction-to-healthcare",
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

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
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: "Category ID",
    example: "clxxx",
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

