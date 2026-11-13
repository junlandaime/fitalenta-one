export type NavItem = {
    label: string;
    href: string;
};

export const siteConfig = {
    logo: "/fitalenta.png",
    name: "FITALENTA",
    tagline: "Empowering people",
    description: "We are dedicated to empowering businesses and individuals through innovative talent management and business consulting solutions.",
} as const;

export const navItems: readonly NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Services", href: "/services" },
    { label: "Programs", href: "/programs" },
    { label: "Blog", href: "/articles" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export const authLinks = {
    login: { label: "Login", href: "/login" },
    register: { label: "Registrasi", href: "/register" },
} as const satisfies Record<string, NavItem>;