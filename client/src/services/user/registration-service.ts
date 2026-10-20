import { api } from "@/lib/axios";
import type { RegistrationValues } from "@/schemas/user/registration";
import type { ApiResponse } from "@/types/api";
import type { CreatedRegistration } from "@/types/user/registration";

function toFormData(values: RegistrationValues): FormData {
    const { ktp, domicile } = values;

    const fields: Record<string, string> = {
        programId: String(values.programId),
        fullName: values.fullName,
        nik: values.nik,
        gender: values.gender,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        phone: values.phone,
        lastEducation: values.lastEducation,
        major: values.major,
        educationInstitution: values.institution,
        currentActivity: values.currentActivity,
        maritalStatus: values.maritalStatus,
        parentRelationship: values.guardianRelation,
        parentPhone: values.guardianPhone,
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

export async function createRegistration(values: RegistrationValues): Promise<CreatedRegistration> {
    const { data } = await api.post<ApiResponse<CreatedRegistration>>(
        "/user/registrations",
        toFormData(values),
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
}
