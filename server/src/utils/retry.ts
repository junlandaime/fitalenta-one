import { MAX_CODE_COLLISION_RETRIES } from "../config/registration.config";
import { AppError } from "./app-error";
import { isUniqueViolation } from "./prisma-error";

interface RetryOptions {
  attempts?: number;
  onExhausted: () => AppError;
}

export async function retryOnUnique<T>(
  operation: () => Promise<T>,
  { attempts = MAX_CODE_COLLISION_RETRIES, onExhausted }: RetryOptions
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (attempt >= attempts) throw onExhausted();
    }
  }
}