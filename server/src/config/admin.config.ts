import { PaymentStatus } from "../../generated/prisma/client";

export const NEW_REGISTRANT_WINDOW_DAYS = 7;

export const REVENUE_PAYMENT_STATUSES: PaymentStatus[] = ["paid"];

export const PENDING_ACTION_PAYMENT_STATUSES: PaymentStatus[] = ["pending"];

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

export const SEARCH_MAX_LENGTH = 100;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;
export const BCRYPT_ROUNDS = 12;