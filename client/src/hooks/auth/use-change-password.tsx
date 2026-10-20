"use client";

import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/auth-service";

export function useChangePassword() {
    return useMutation({ mutationFn: changePassword });
}
