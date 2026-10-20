"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/auth-service";

export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            router.push("/login?reset=1");
        },
    });
}
