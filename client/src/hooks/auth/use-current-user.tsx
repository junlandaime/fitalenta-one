"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { fetchCurrentUser } from "@/services/auth-service";

export function useCurrentUser() {
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    const query = useQuery({
        queryKey: ["auth", "me"],
        queryFn: fetchCurrentUser,
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        } else if (query.isError) {
            clearUser();
        }
    }, [query.data, query.isError, setUser, clearUser]);

    return query;
}