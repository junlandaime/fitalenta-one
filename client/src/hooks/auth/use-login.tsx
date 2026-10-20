"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { login } from "@/services/auth-service";
import { getHomeByRole, normalizeRole } from "@/lib/auth-role";

export function useLogin() {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: login,
        onSuccess: ({ user }) => {
            setUser(user);
            const target = getHomeByRole(normalizeRole(user.role));
            window.location.href = target;
        },
    });
}
