import { Program } from "../../../generated/prisma/client";
import { RegistrationErrors } from "../../errors/registration.errors";
import { endOfDeadlineDay } from "../../utils/date";

type PolicyProgram = Pick<
  Program,
  "status" | "registrationDeadline" | "capacity" | "currentParticipants"
>;

export function assertProgramAcceptsRegistration(program: PolicyProgram, now = new Date()): void {
  if (program.status === "full") throw RegistrationErrors.programFull();
  if (program.status !== "active") throw RegistrationErrors.programNotActive();

  if (program.registrationDeadline && now > endOfDeadlineDay(program.registrationDeadline)) {
    throw RegistrationErrors.deadlinePassed();
  }

  if (program.capacity !== null && program.currentParticipants >= program.capacity) {
    throw RegistrationErrors.programFull();
  }
}