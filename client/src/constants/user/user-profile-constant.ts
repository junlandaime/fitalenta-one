export const PROFILE_LIMITS = {
    nameMin: 3,
    nameMax: 255,
    birthPlaceMax: 100,
    addressMax: 500,
} as const;

export const NOT_CLEARABLE_FIELDS = [
    { field: "phone", label: "Nomor telepon" },
    { field: "birthDate", label: "Tanggal lahir" },
] as const;
