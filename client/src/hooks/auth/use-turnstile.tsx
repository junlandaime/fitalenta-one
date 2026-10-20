"use client";

import { useCallback, useState } from "react";
import { TURNSTILE_ENABLED, TURNSTILE_MISCONFIGURED } from "@/constants/auth-constant";

export type TurnstileController = {
    widgetKey: number;
    ready: boolean;
    token: string | undefined;
    failed: boolean;
    onSuccess: (token: string) => void;
    onExpire: () => void;
    onError: () => void;
    reset: () => void;
};

export function useTurnstile(): TurnstileController {
    const [widgetKey, setWidgetKey] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    const onSuccess = useCallback((value: string) => {
        setToken(value);
        setFailed(false);
    }, []);
    const onExpire = useCallback(() => setToken(null), []);
    const onError = useCallback(() => {
        setToken(null);
        setFailed(true);
    }, []);
    const reset = useCallback(() => {
        setToken(null);
        setWidgetKey((key) => key + 1);
    }, []);

    return {
        widgetKey,
        ready: TURNSTILE_MISCONFIGURED ? false : !TURNSTILE_ENABLED || token !== null,
        token: token ?? undefined,
        failed,
        onSuccess,
        onExpire,
        onError,
        reset,
    };
}
