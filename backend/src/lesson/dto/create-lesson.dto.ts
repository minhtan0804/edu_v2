import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateLessonDto {
  @ApiProperty({
    description: "Lesson title",
    example: "Introduction to Healthcare Basics",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Lesson position in section",
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({
    description: "Bunny.net video ID",
    example: "video-id-123",
    required: false,
  })
  @IsOptional()
  @IsString()
  videoId?: string;

  @ApiProperty({
    description: "Document URL (PDF)",
    example: "https://example.com/document.pdf",
    required: false,
  })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiProperty({
    description: "Section ID",
    example: "clxxx",
  })
  @IsNotEmpty()
  @IsString()
  sectionId: string;
}

