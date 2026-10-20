"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EDITOR_CMS_KEY } from "@/hooks/editor/use-editor-cms";
import {
    createEditorTestimonial,
    deleteEditorTestimonial,
    getEditorTestimonials,
    toggleEditorTestimonial,
    updateEditorTestimonial,
} from "@/services/editor/editor-testimonial-service";
import type { EditorTestimonialPayload } from "@/types/editor/editor-testimonial";

const EDITOR_TESTIMONIALS_KEY = ["editor", "testimonials"] as const;

export function useEditorTestimonials() {
    return useQuery({
        queryKey: [...EDITOR_TESTIMONIALS_KEY, "list"],
        queryFn: getEditorTestimonials,
    });
}

type SaveVariables = { id?: number; payload: EditorTestimonialPayload };

function useInvalidateTestimonials() {
    const queryClient = useQueryClient();
    return () =>
        Promise.all([
            queryClient.invalidateQueries({ queryKey: EDITOR_TESTIMONIALS_KEY }),
            queryClient.invalidateQueries({ queryKey: EDITOR_CMS_KEY }),
        ]);
}

export function useSaveEditorTestimonial() {
    const invalidate = useInvalidateTestimonials();

    return useMutation({
        mutationFn: ({ id, payload }: SaveVariables) =>
            id !== undefined ? updateEditorTestimonial(id, payload) : createEditorTestimonial(payload),
        onSuccess: invalidate,
    });
}

export function useDeleteEditorTestimonial() {
    const invalidate = useInvalidateTestimonials();

    return useMutation({
        mutationFn: deleteEditorTestimonial,
        onSuccess: invalidate,
    });
}

export function useToggleEditorTestimonial() {
    const invalidate = useInvalidateTestimonials();

    return useMutation({
        mutationFn: toggleEditorTestimonial,
        onSuccess: invalidate,
    });
}
