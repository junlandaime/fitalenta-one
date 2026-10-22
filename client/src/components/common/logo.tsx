import { siteConfig } from "@/constants/site-config";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
    tone?: "dark" | "light";
    width: number | `${number}`;
    height: number | `${number}`;
    className?: string;
};

export function Logo({ tone = "dark", width, height, className }: LogoProps) {
    const h = typeof height === "number" ? `${height}px` : height;

    return (
        <Link
            href="/"
            aria-label={`${siteConfig.name}, home`}
            className={cn(
                "inline-flex items-center leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4",
                tone === "dark"
                    ? "text-primary focus-visible:ring-primary"
                    : "text-white focus-visible:ring-white focus-visible:ring-offset-[#10302B]"
            )}
        >
            <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={Number(width) || 108}
                height={Number(height) || 40}
                style={{
                    width: "auto",
                    height: h,
                    maxHeight: h,
                }}
                className={cn("w-auto object-contain shrink-0", className)}
                loading="eager"
                priority
            />
        </Link>
    );
}
