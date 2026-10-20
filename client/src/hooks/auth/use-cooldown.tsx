"use client";

import { useCallback, useEffect, useState } from "react";

export function useCooldown(seconds: number) {
    const [endsAt, setEndsAt] = useState<number | null>(null);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if (endsAt === null) return;

        const id = setInterval(() => {
            const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0) setEndsAt(null);
        }, 1000);

        return () => clearInterval(id);
    }, [endsAt]);

    const start = useCallback(() => {
        setRemaining(seconds);
        setEndsAt(Date.now() + seconds * 1000);
    }, [seconds]);

    return { remaining, start };
}
