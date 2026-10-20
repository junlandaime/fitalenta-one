"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth-service";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            router.push("/login?registered=1");
        },
    });
}