import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const error: ApiError = {
      message: "Internal server error",
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        error.message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          error.message = "Validation failed";
          error.code = "VALIDATION_FAILED";
          error.details = this.formatValidationErrors(
            responseObj.message as string[]
          );
        } else {
          error.message = (responseObj.message as string) || exception.message;
          error.code = (responseObj.code as string) || exception.name;
        }
      }
    } else if (exception instanceof Error) {
      error.message = exception.message;
      error.code = exception.name;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error,
    };

    response.status(status).json(errorResponse);
  }

  private formatValidationErrors(messages: string[]): Record<string, string> {
    const details: Record<string, string> = {};

    messages.forEach((message) => {
      // Extract field name from validation message
      // Format: "email must be an email" -> { email: "must be an email" }
      // Format: "email should not be empty" -> { email: "should not be empty" }
      const match = message.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const [, field, errorMessage] = match;
        details[field] = errorMessage;
      } else {
        // If can't parse, use the whole message as key
        details[message] = message;
      }
    });

    return details;
  }
}
