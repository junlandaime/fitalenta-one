"use client";

import { useEffect, useState } from "react";
import { useRegistrationStore } from "@/store/registration-store";

export function useRegistrationHydrated() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        Promise.resolve(useRegistrationStore.persist.rehydrate()).then(() => setHydrated(true));
    }, []);

    return hydrated;
}
