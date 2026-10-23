import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 400,
    public code: string = "BAD_REQUEST",
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Autentikasi diperlukan") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Akses ditolak: Anda tidak memiliki wewenang untuk tindakan ini") {
    super(message, 403, "FORBIDDEN");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Sumber daya") {
    super(`${resource} tidak ditemukan`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : "Terjadi kesalahan internal server";
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: process.env.NODE_ENV === "production" ? "Terjadi kesalahan pada server" : message,
      },
    },
    { status: 500 }
  );
}