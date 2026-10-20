export type RegistrationStep = 1 | 2 | 3;

export type AddressKind = "ktp" | "domicile";

export type RegistrationAddress = {
    provinceCode: string;
    provinceName: string;
    cityCode: string;
    cityName: string;
    detail: string;
};

export type RegistrationDraft = {
    photo: File | null;
    fullName: string;
    nik: string;
    gender: string;
    birthPlace: string;
    birthDate: string;
    phone: string;
    lastEducation: string;
    major: string;
    institution: string;
    currentActivity: string;
    maritalStatus: string;
    guardianRelation: string;
    guardianPhone: string;
    ktp: RegistrationAddress;
    sameAsKtp: boolean;
    domicile: RegistrationAddress;
    programId: number | null;
    agreed: boolean;
};

export type StringFieldName = {
    [K in keyof RegistrationDraft]: RegistrationDraft[K] extends string ? K : never;
}[keyof RegistrationDraft];

export type FieldErrors = Record<string, string>;

export type CreatedRegistration = {
    id: number;
    registrationCode: string;
};

export type Region = {
    id: string;
    name: string;
};
