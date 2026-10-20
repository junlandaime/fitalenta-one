"use client";

import { useQuery } from "@tanstack/react-query";
import { getProvinces, getRegencies } from "@/services/user/region-service";

export function useProvinces() {
    return useQuery({
        queryKey: ["regions", "provinces"],
        queryFn: getProvinces,
        staleTime: Infinity,
    });
}

export function useRegencies(provinceCode: string) {
    return useQuery({
        queryKey: ["regions", "regencies", provinceCode],
        queryFn: () => getRegencies(provinceCode),
        enabled: Boolean(provinceCode),
        staleTime: Infinity,
    });
}
