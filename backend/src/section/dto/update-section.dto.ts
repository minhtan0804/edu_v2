import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateSectionDto {
  @ApiProperty({
    description: "Section title",
    example: "Introduction",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Section position in course",
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
