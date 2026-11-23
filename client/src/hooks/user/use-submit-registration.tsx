"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormTemplate, RegistrationValues } from "@/schemas/user/registration";
import { createRegistration } from "@/services/user/registration-service";

export function useSubmitRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ values, template }: { values: RegistrationValues; template?: FormTemplate }) =>
            createRegistration(values, template),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        },
    });
}
