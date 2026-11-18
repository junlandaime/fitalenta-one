"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { normalizeRole } from "@/lib/auth-role";

type ProgramRegisterLinkProps = {
    programId: number;
    className?: string;
    children: ReactNode;
};

const subscribe = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

export function ProgramRegisterLink({ programId, className, children }: ProgramRegisterLinkProps) {
    const hydrated = useSyncExternalStore(subscribe, getHydratedSnapshot, getServerSnapshot);
    const { data: user } = useCurrentUser();

    const isParticipant = hydrated && user ? normalizeRole(user.role) === "user" : false;
    const href = isParticipant ? `/user/pendaftaran?program=${programId}` : "/register";

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}