"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRegistration } from "@/services/user/registration-service";

export function useSubmitRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRegistration,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        },
    });
}
