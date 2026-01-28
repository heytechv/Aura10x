// src/lib/handle-service-error.ts
import { AuthError, PostgrestError } from "@supabase/supabase-js";

/**
 * Custom application error class to standardize error handling.
 * @param message - The error message.
 * @param statusCode - The HTTP status code associated with the error.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Handles errors from Supabase and other services, wrapping them in AppError.
 * @param error - The error object to handle.
 * @returns An instance of AppError.
 */
export const handleServiceError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  let errorMessage = "An unexpected error occurred.";
  let statusCode = 500;

  if (error instanceof PostgrestError) {
    errorMessage = `Database error: ${error.message}`;
    // You might want to map specific PostgrestError codes to HTTP status codes
    // For example, '23505' is a unique constraint violation
    if (error.code === "23505") {
      statusCode = 409; // Conflict
    }
  } else if (error instanceof AuthError) {
    errorMessage = `Authentication error: ${error.message}`;
    statusCode = 401; // Unauthorized
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error("Service Error:", error); // For server-side logging

  return new AppError(errorMessage, statusCode);
};
