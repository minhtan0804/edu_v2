import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateLessonDto {
  @ApiProperty({
    description: "Lesson title",
    example: "Introduction to Healthcare Basics",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Lesson position in section",
    example: 0,
    required: false,
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
}
