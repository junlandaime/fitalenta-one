"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { login } from "@/services/auth-service";
import { getHomeByRole, normalizeRole } from "@/lib/auth-role";

export function useLogin() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: login,
        onSuccess: ({ user }) => {
            setUser(user);
            router.push(getHomeByRole(normalizeRole(user.role)));
            router.refresh();
        },
    });
}