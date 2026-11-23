import { api } from "@/lib/axios";
import type {
    AvionicsRegistrationValues,
    DefaultRegistrationValues,
    FormTemplate,
    RegistrationValues,
} from "@/schemas/user/registration";
import type { ApiResponse } from "@/types/api";
import type { CreatedRegistration } from "@/types/user/registration";

const cleanPhone = (value: string) => value.replace(/[\s\-().]/g, "");

function toDefaultFormData(values: DefaultRegistrationValues): FormData {
    const { ktp, domicile } = values;

    const fields: Record<string, string> = {
        programId: String(values.programId),
        fullName: values.fullName,
        nik: values.nik,
        gender: values.gender,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        phone: cleanPhone(values.phone),
        lastEducation: values.lastEducation,
        major: values.major,
        educationInstitution: values.institution,
        currentActivity: values.currentActivity,
        maritalStatus: values.maritalStatus,
        parentRelationship: values.guardianRelation,
        parentPhone: cleanPhone(values.guardianPhone),
        ktpProvinceCode: ktp.provinceCode,
        ktpProvinceName: ktp.provinceName,
        ktpCityCode: ktp.cityCode,
        ktpCityName: ktp.cityName,
        ktpAddress: ktp.detail,
        domicileProvinceCode: domicile.provinceCode,
        domicileProvinceName: domicile.provinceName,
        domicileCityCode: domicile.cityCode,
        domicileCityName: domicile.cityName,
        domicileAddress: domicile.detail,
    };

    const body = new FormData();
    for (const [key, value] of Object.entries(fields)) body.append(key, value);
    body.append("photo", values.photo);
    return body;
}

function toAvionicsFormData(values: AvionicsRegistrationValues): FormData {
    const education =
        values.lastEducation === "Lainnya" ? values.otherEducation.trim() : values.lastEducation;

    const fields: Record<string, string> = {
        programId: String(values.programId),
        fullName: values.fullName,
        gender: values.gender,
        birthDate: values.birthDate,
        phone: cleanPhone(values.phone),
        domicileCityName: values.domicileCity.trim(),
        domicileAddress: values.domicileCity.trim(),
        lastEducation: education,
        major: values.major,
        educationInstitution: values.institution,
        gpa: values.gpa.replace(",", "."),
        colorBlindStatus: values.colorBlindStatus,
    };

    const body = new FormData();
    for (const [key, value] of Object.entries(fields)) body.append(key, value);

    body.append("photo", values.photo);
    body.append("ktp", values.ktpFile);
    body.append("diploma", values.diplomaFile);
    body.append("transcript", values.transcriptFile);
    body.append("cv", values.cvFile);

    const optionalFiles: [string, File | null | undefined][] = [
        ["healthCert", values.healthCertFile],
        ["colorBlindCert", values.colorBlindCertFile],
        ["drugFreeCert", values.drugFreeCertFile],
        ["toeicCert", values.toeicCertFile],
        ["supportingDocs", values.supportingDocsFile],
    ];
    for (const [field, file] of optionalFiles) {
        if (file) body.append(field, file);
    }

    return body;
}

export async function createRegistration(
    values: RegistrationValues,
    template: FormTemplate = "default",
): Promise<CreatedRegistration> {
    const body =
        template === "avionics"
            ? toAvionicsFormData(values as AvionicsRegistrationValues)
            : toDefaultFormData(values as DefaultRegistrationValues);

    const { data } = await api.post<ApiResponse<CreatedRegistration>>(
        "/user/registrations",
        body,
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
}
