import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    AddressKind,
    FieldErrors,
    RegistrationAddress,
    RegistrationDraft,
    RegistrationStep,
} from "@/types/user/registration";

const createEmptyAddress = (): RegistrationAddress => ({
    provinceCode: "",
    provinceName: "",
    cityCode: "",
    cityName: "",
    detail: "",
});

const createInitialDraft = (): RegistrationDraft => ({
    photo: null,
    fullName: "",
    nik: "",
    gender: "",
    birthPlace: "",
    birthDate: "",
    phone: "",
    lastEducation: "",
    major: "",
    institution: "",
    currentActivity: "",
    maritalStatus: "",
    guardianRelation: "",
    guardianPhone: "",
    ktp: createEmptyAddress(),
    sameAsKtp: false,
    domicile: createEmptyAddress(),
    programId: null,
    agreed: false,
});

type RegistrationState = {
    step: RegistrationStep;
    draft: RegistrationDraft;
    photoPreview: string | null;
    errors: FieldErrors;
    setField: <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => void;
    setPhoto: (file: File | null) => void;
    setAddress: (kind: AddressKind, patch: Partial<RegistrationAddress>) => void;
    setSameAsKtp: (checked: boolean) => void;
    setErrors: (errors: FieldErrors) => void;
    setError: (key: string, message: string) => void;
    goToStep: (step: RegistrationStep) => void;
    reset: () => void;
};

function withoutErrors(errors: FieldErrors, shouldRemove: (key: string) => boolean): FieldErrors {
    const keys = Object.keys(errors).filter(shouldRemove);
    if (keys.length === 0) return errors;

    const next = { ...errors };
    for (const key of keys) delete next[key];
    return next;
}

export const useRegistrationStore = create<RegistrationState>()(
    persist(
        (set, get) => ({
            step: 1,
            draft: createInitialDraft(),
            photoPreview: null,
            errors: {},

            setField: (key, value) =>
                set((state) => ({
                    draft: { ...state.draft, [key]: value },
                    errors: withoutErrors(state.errors, (k) => k === key),
                })),

            setPhoto: (file) => {
                set((state) => ({
                    draft: { ...state.draft, photo: file },
                    photoPreview: null,
                    errors: withoutErrors(state.errors, (k) => k === "photo"),
                }));
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    if (get().draft.photo === file) set({ photoPreview: String(reader.result) });
                };
                reader.readAsDataURL(file);
            },

            setAddress: (kind, patch) =>
                set((state) => {
                    const address = { ...state.draft[kind], ...patch };
                    const draft: RegistrationDraft = { ...state.draft };
                    draft[kind] = address;

                    const touched = Object.keys(patch);
                    const mirrored = kind === "ktp" && state.draft.sameAsKtp;
                    if (mirrored) draft.domicile = { ...address };

                    return {
                        draft,
                        errors: withoutErrors(state.errors, (key) => {
                            const [section, field] = key.split(".");
                            const inScope = section === kind || (mirrored && section === "domicile");
                            return inScope && touched.includes(field);
                        }),
                    };
                }),

            setSameAsKtp: (checked) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        sameAsKtp: checked,
                        domicile: checked ? { ...state.draft.ktp } : state.draft.domicile,
                    },
                    errors: checked
                        ? withoutErrors(state.errors, (key) => key.startsWith("domicile."))
                        : state.errors,
                })),

            setErrors: (errors) => set({ errors }),

            setError: (key, message) =>
                set((state) => ({ errors: { ...state.errors, [key]: message } })),

            goToStep: (step) => set({ step, errors: {} }),

            reset: () =>
                set({ step: 1, draft: createInitialDraft(), photoPreview: null, errors: {} }),
        }),
        {
            name: "fitalenta-registration-draft",
            version: 1,
            skipHydration: true,
            partialize: (state) => ({ draft: { ...state.draft, photo: null } }),
            merge: (persisted, current) => {
                const saved = (persisted as { draft?: Partial<RegistrationDraft> } | undefined)?.draft;
                if (!saved) return current;

                return {
                    ...current,
                    draft: {
                        ...current.draft,
                        ...saved,
                        photo: null,
                        ktp: { ...current.draft.ktp, ...saved.ktp },
                        domicile: { ...current.draft.domicile, ...saved.domicile },
                    },
                };
            },
        },
    ),
);
