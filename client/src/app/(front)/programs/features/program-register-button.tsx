import type { ReactNode } from "react";
import Link from "next/link";
import { ProgramRegisterLink } from "./program-register-link";

export type ProgramArea = "public" | "user";

type ProgramRegisterButtonProps = {
    programId: number;
    area: ProgramArea;
    className?: string;
    children: ReactNode;
};

export function ProgramRegisterButton({ programId, area, className, children }: ProgramRegisterButtonProps) {
    if (area === "user") {
        return (
            <Link href={`/user/pendaftaran?program=${programId}`} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <ProgramRegisterLink programId={programId} className={className}>
            {children}
        </ProgramRegisterLink>
    );
}