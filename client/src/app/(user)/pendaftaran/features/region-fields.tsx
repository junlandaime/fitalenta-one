"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProvinces, useRegencies } from "@/hooks/auth/use-regions";
import { cn } from "@/lib/utils";
import { useRegistrationStore } from "@/store/registration-store";
import type { AddressKind, RegistrationAddress } from "@/types/user/registration";
import { CONTROL_CLASS, FieldShell, fieldA11y } from "./form-field";
import { FIELD_GRID } from "./form-section";

const DETAIL_HINT = "Tuliskan nama jalan, nomor, RT/RW, kelurahan, dan kecamatan.";

type RegionFieldsProps = {
    kind: AddressKind;
    disabled?: boolean;
};

export function RegionFields({ kind, disabled = false }: RegionFieldsProps) {
    const address = useRegistrationStore((state) => state.draft[kind]);
    const errors = useRegistrationStore((state) => state.errors);
    const setAddress = useRegistrationStore((state) => state.setAddress);

    const provinces = useProvinces();
    const cities = useRegencies(address.provinceCode);

    const errorOf = (field: keyof RegistrationAddress) => errors[`${kind}.${field}`];

    function handleProvinceChange(code: string) {
        const province = provinces.data?.find((item) => item.id === code);
        setAddress(kind, {
            provinceCode: code,
            provinceName: province?.name ?? "",
            cityCode: "",
            cityName: "",
        });
    }

    function handleCityChange(code: string) {
        const city = cities.data?.find((item) => item.id === code);
        setAddress(kind, { cityCode: code, cityName: city?.name ?? "" });
    }

    const provinceId = `${kind}-province`;
    const cityId = `${kind}-city`;
    const detailId = `${kind}-detail`;

    return (
        <div className="space-y-4">
            <div className={FIELD_GRID}>
                <FieldShell
                    id={provinceId}
                    label="Provinsi"
                    required
                    error={errorOf("provinceCode")}
                    hint={provinces.isError ? "Daftar provinsi gagal dimuat. Muat ulang halaman." : undefined}
                >
                    <Select value={address.provinceCode} onValueChange={handleProvinceChange} disabled={disabled}>
                        <SelectTrigger
                            id={provinceId}
                            className={cn(CONTROL_CLASS, "w-full")}
                            {...fieldA11y(provinceId, errorOf("provinceCode"))}
                        >
                            <SelectValue placeholder={provinces.isPending ? "Memuat provinsi..." : "Pilih provinsi"}>
                                {address.provinceName || undefined}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.data?.map((province) => (
                                <SelectItem key={province.id} value={province.id}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldShell>

                <FieldShell id={cityId} label="Kabupaten/Kota" required error={errorOf("cityCode")}>
                    <Select
                        value={address.cityCode}
                        onValueChange={handleCityChange}
                        disabled={disabled || !address.provinceCode}
                    >
                        <SelectTrigger
                            id={cityId}
                            className={cn(CONTROL_CLASS, "w-full")}
                            {...fieldA11y(cityId, errorOf("cityCode"))}
                        >
                            <SelectValue
                                placeholder={
                                    !address.provinceCode
                                        ? "Pilih provinsi terlebih dahulu"
                                        : cities.isFetching
                                            ? "Memuat kabupaten/kota..."
                                            : "Pilih kabupaten/kota"
                                }
                            >
                                {address.cityName || undefined}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {cities.data?.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FieldShell>
            </div>

            <FieldShell
                id={detailId}
                label="Detail alamat"
                required
                error={errorOf("detail")}
                hint={DETAIL_HINT}
            >
                <Textarea
                    id={detailId}
                    value={address.detail}
                    onChange={(event) => setAddress(kind, { detail: event.target.value })}
                    disabled={disabled}
                    rows={3}
                    {...fieldA11y(detailId, errorOf("detail"), DETAIL_HINT)}
                />
            </FieldShell>
        </div>
    );
}
