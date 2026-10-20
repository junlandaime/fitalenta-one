import { REGISTRATION_TIMEZONE_OFFSET_HOURS } from "../config/registration.config";

const MS_PER_HOUR = 3_600_000;

export function endOfDeadlineDay(deadline: Date): Date {
  return new Date(deadline.getTime() + (24 - REGISTRATION_TIMEZONE_OFFSET_HOURS) * MS_PER_HOUR - 1);
}