import { siteConfig } from "@/constants/site-config";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    tone?: "dark" | "light";
    width: number | `${number}`
    height: number | `${number}`
};

export function Logo({ tone = "dark", width, height }: LogoProps) {
    return (
        <Link
            href="/"
            aria-label={`${siteConfig.name}, home`}
            className={`inline-block leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${tone === "dark"
                ? "text-primary focus-visible:ring-primary"
                : "text-white focus-visible:ring-white focus-visible:ring-offset-[#10302B]"
                }`}
        >
            <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={width}
                height={height}
                style={{
                    width: "auto",
                    height: "auto",
                }}
                loading="eager"
            />
        </Link>
    );
}