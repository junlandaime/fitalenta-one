import { NOT_CLEARABLE_FIELDS } from "@/constants/user/user-profile-constant";
import type { ProfileFormValues } from "@/schemas/user/user-profile";
import type { MyProfile, MyProfileUpdatePayload } from "@/types/user/user-profile";

type ProfileSource = Pick<MyProfile, "name" | "phone" | "address" | "birthPlace" | "birthDate">;

export function toDateInputValue(iso?: string | null) {
    return iso ? iso.slice(0, 10) : "";
}

export function toProfileFormValues(profile: ProfileSource): ProfileFormValues {
    return {
        name: profile.name,
        phone: profile.phone ?? "",
        birthPlace: profile.birthPlace ?? "",
        birthDate: toDateInputValue(profile.birthDate),
        address: profile.address ?? "",
    };
}

export function normalizeProfileValues(values: ProfileFormValues): ProfileFormValues {
    return {
        name: values.name.trim(),
        phone: values.phone.trim(),
        birthPlace: values.birthPlace.trim(),
        birthDate: values.birthDate,
        address: values.address.trim(),
    };
}

export function buildProfilePayload(original: ProfileSource, data: ProfileFormValues): MyProfileUpdatePayload {
    const payload: MyProfileUpdatePayload = {};

    if (data.name !== original.name) payload.name = data.name;
    if (data.phone && data.phone !== (original.phone ?? "")) payload.phone = data.phone;
    if (data.birthPlace !== (original.birthPlace ?? "")) payload.birthPlace = data.birthPlace;
    if (data.address !== (original.address ?? "")) payload.address = data.address;
    if (data.birthDate && data.birthDate !== toDateInputValue(original.birthDate)) payload.birthDate = data.birthDate;

    return payload;
}

export function validateClearedFields(original: ProfileSource, data: ProfileFormValues) {
    const errors: Partial<Record<keyof ProfileFormValues, string>> = {};
    const originalValues = toProfileFormValues(original);

    for (const { field, label } of NOT_CLEARABLE_FIELDS) {
        if (originalValues[field] && !data[field]) errors[field] = `${label} tidak dapat dikosongkan.`;
    }
    return errors;
}
