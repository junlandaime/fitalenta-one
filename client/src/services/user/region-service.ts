import axios from "axios";
import type { Region } from "@/types/user/registration";

const REGION_API_URL =
    process.env.NEXT_PUBLIC_REGION_API_URL ?? "https://www.emsifa.com/api-wilayah-indonesia/api";

const KEEP_UPPERCASE = new Set(["DKI", "DI"]);

function toTitleCase(name: string): string {
    return name
        .split(" ")
        .map((word) =>
            KEEP_UPPERCASE.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase(),
        )
        .join(" ");
}

async function fetchRegions(path: string): Promise<Region[]> {
    const { data } = await axios.get<Region[]>(`${REGION_API_URL}/${path}.json`);
    return data.map((region) => ({ id: region.id, name: toTitleCase(region.name) }));
}

export const getProvinces = () => fetchRegions("provinces");

export const getRegencies = (provinceCode: string) => fetchRegions(`regencies/${provinceCode}`);
