import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        // Format validation errors
        return new ValidationPipe().createExceptionFactory()(errors);
      },
    })
  );

  // Global response interceptor to format success responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global exception filter to format error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global prefix for all routes
  app.setGlobalPrefix("api");

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("EdTech Healthcare Platform API")
    .setDescription(
      "API documentation for EdTech Healthcare Platform - A comprehensive education platform for healthcare courses"
    )
    .setVersion("1.0.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("categories", "Category management endpoints")
    .addTag("instructors", "Instructor verification endpoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth" // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addServer("http://localhost:3000/api", "Development server")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger API Documentation: http://localhost:${port}/api-docs`
  );
  console.log(`🔗 API Base URL: http://localhost:${port}/api`);
}
bootstrap();
