import { NEW_PROGRAM_DEFAULTS } from "@/constants/admin/admin-program-constant";
import type { ProgramFormValues } from "@/schemas/admin/admin-program";
import type { AdminProgram, AdminProgramDetail } from "@/types/admin/admin-program";

export function createEmptyProgramForm(): ProgramFormValues {
    return {
        name: "",
        programFormat: "",
        categoryId: "",
        description: "",
        location: NEW_PROGRAM_DEFAULTS.location,
        contactInfo: "",
        requirements: "",
        requirementsText: "",
        schedule: "",
        timelineText: "",
        duration: "",
        capacity: "",
        registrationDeadline: "",
        startDate: "",
        endDate: "",
        trainingCost: NEW_PROGRAM_DEFAULTS.trainingCost,
        trainingFeeDetails: "",
        departureCost: NEW_PROGRAM_DEFAULTS.departureCost,
        departureFeeDetails: "",
        installmentPlan: "none",
        downPayment: "0",
        jobMatchingCost: "0",
        bridgeFund: NEW_PROGRAM_DEFAULTS.bridgeFund,
        status: "active",
        isRunning: false,
        sortOrder: NEW_PROGRAM_DEFAULTS.sortOrder,
    };
}

const moneyInput = (value: string | null | undefined) => (value == null ? "0" : String(Number(value)));

export function toProgramFormValues(program: AdminProgramDetail): ProgramFormValues {
    return {
        name: program.name,
        programFormat: program.programFormat ?? "",
        categoryId: program.categoryId ? String(program.categoryId) : "",
        description: program.description ?? "",
        location: program.location ?? "",
        contactInfo: program.contactInfo ?? "",
        requirements: program.requirements ?? "",
        requirementsText: program.requirementsText ?? "",
        schedule: program.schedule ?? "",
        timelineText: program.timelineText ?? "",
        duration: program.duration ?? "",
        capacity: program.capacity === null ? "" : String(program.capacity),
        registrationDeadline: program.registrationDeadline ?? "",
        startDate: program.startDate ?? "",
        endDate: program.endDate ?? "",
        trainingCost: moneyInput(program.trainingCost),
        trainingFeeDetails: program.trainingFeeDetails ?? "",
        departureCost: moneyInput(program.departureCost),
        departureFeeDetails: program.departureFeeDetails ?? "",
        installmentPlan: program.installmentPlan || "none",
        downPayment: moneyInput(program.downPayment),
        jobMatchingCost: moneyInput(program.jobMatchingCost),
        bridgeFund: program.bridgeFund ?? "",
        status: program.status,
        isRunning: program.isRunning,
        sortOrder: String(program.sortOrder),
    };
}

export function getQuotaPercent(program: Pick<AdminProgram, "capacity" | "currentParticipants">) {
    if (!program.capacity) return undefined;
    return Math.min(100, Math.round((program.currentParticipants / program.capacity) * 100));
}
