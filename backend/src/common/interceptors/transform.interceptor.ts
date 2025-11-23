import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Response<T> {
  success: true;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(_: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has success field, return as is
        if (data && typeof data === "object" && "success" in data) {
          return data;
        }

        // Otherwise, wrap in success response
        return {
          success: true as const,
          data,
        };
      })
    );
  }
}
