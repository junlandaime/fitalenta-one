"use client";

import { useCallback, useState } from "react";

type FormValues = Record<string, string | boolean>;

export type CmsFormErrors<T extends FormValues> = Partial<Record<keyof T & string, string>>;

export function useCmsForm<T extends FormValues>(id: string, initial: T) {
    const [values, setValues] = useState<T>(initial);
    const [errors, setErrors] = useState<CmsFormErrors<T>>({});

    const setValue = useCallback(<K extends keyof T & string>(name: K, value: T[K]) => {
        setValues((current) => ({ ...current, [name]: value }));
        setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    }, []);

    return { id, values, errors, setValue, setErrors };
}

export type CmsForm<T extends FormValues> = ReturnType<typeof useCmsForm<T>>;
