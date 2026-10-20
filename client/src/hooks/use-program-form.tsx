"use client";

import { useCallback, useState } from "react";
import type { ProgramFormValues } from "@/schemas/admin/admin-program";

export type ProgramFormErrors = Partial<Record<keyof ProgramFormValues, string>>;

export function useProgramForm(initial: ProgramFormValues) {
    const [values, setValues] = useState<ProgramFormValues>(initial);
    const [errors, setErrors] = useState<ProgramFormErrors>({});

    const setValue = useCallback(<K extends keyof ProgramFormValues>(name: K, value: ProgramFormValues[K]) => {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    }, []);

    return { values, errors, setValue, setErrors };
}

export type ProgramForm = ReturnType<typeof useProgramForm>;
