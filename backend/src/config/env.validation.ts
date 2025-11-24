import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  // Database
  DATABASE_URL: Joi.string()
    .required()
    .description("PostgreSQL database connection URL"),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .required()
    .min(32)
    .description("JWT secret key for access tokens"),
  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32)
    .description("JWT secret key for refresh tokens"),
  JWT_EXPIRES_IN: Joi.string()
    .default("1d")
    .description("JWT access token expiration (e.g., 1d, 24h)"),
  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default("7d")
    .description("JWT refresh token expiration (e.g., 7d)"),

  // Server Configuration
  PORT: Joi.number().default(3000).description("Server port"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development")
    .description("Node environment"),

  // CORS
  FRONTEND_URL: Joi.string()
    .default("http://localhost:5173")
    .description("Frontend URL for CORS"),

  // Email Configuration (Resend)
  RESEND_API_KEY: Joi.string()
    .optional()
    .description("Resend API key for email service"),
  RESEND_FROM_EMAIL: Joi.string()
    .optional()
    .description("Resend from email address"),
});
