import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { navItems, siteConfig } from "@/constants/site-config";
import { getContactMock } from "@/constants/contact-constant";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

const linkClass =
    "text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#10302B]";

const socialIcons = { facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedin } as const;

function FooterHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h2 className="relative inline-block pb-2 text-lg font-bold text-white">
                {children}
                <span className="absolute bottom-0 left-0 h-1 w-10 rounded-full bg-secondary"></span>
            </h2>
        </div>
    );
}

export async function Footer() {
    const contact = await getContactMock();

    return (
        <footer className="bg-primary text-white">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1.2fr_1.3fr] lg:gap-10">
                    
                    <div className="max-w-xs">
                        <FooterHeading>Tentang kami</FooterHeading>
                        <div className="mb-6 mt-2">
                           <Logo tone="light" width={700} height={90} />
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-white/70">
                            {siteConfig.description}
                        </p>
                        <Link
                            href="/about"
                            className="mb-8 inline-block rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Tentang kami
                        </Link>
                        
                        {contact.socials.length > 0 && (
                            <ul className="flex flex-wrap gap-3 text-sm">
                                {contact.socials.map((social) => {
                                    const Icon = socialIcons[social.name];
                                    return (
                                        <li key={social.href}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex size-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-secondary"
                                            >
                                                <Icon size={18} />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <nav aria-label="Footer">
                        <FooterHeading>Navigasi</FooterHeading>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className={`${linkClass}`}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <FooterHeading>Kantor FITALENTA</FooterHeading>
                        <address className="space-y-4 text-sm not-italic">
                            <p className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
                                <a
                                    href={contact.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${linkClass} leading-relaxed`}
                                >
                                    {contact.addressLines.map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="size-5 shrink-0 text-secondary" aria-hidden />
                                <span className={`${linkClass}`}>
                                    {contact.phone}
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="size-5 shrink-0 text-secondary" aria-hidden />
                                <span className={`${linkClass}`}>
                                    {contact.email}
                                </span>
                            </p>
                            
                            <div className="pt-3">
                                <p className="font-bold text-white">Jam Buka:</p>
                                <p className="mt-1 text-white/70">Senin – Jumat : 08:00 – 17:00</p>
                                <p className="text-white/70">Sabtu & Minggu : Libur</p>
                            </div>
                        </address>
                    </div>

                    <div>
                        <FooterHeading>Portal FITALENTA</FooterHeading>
                        <p className="mb-6 text-sm leading-relaxed text-white/70">
                            Portal web untuk mengelola data peserta pelatihan FITALENTA. Bagi yang ingin mendaftar kelas atau mengikuti proses job matching, harap login ke situs web di bawah ini. Jika Anda belum memiliki akun, silakan melakukan registrasi terlebih dahulu.
                        </p>
                        <Link
                            href="/user/dashboard"
                            className="inline-block rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            Portal FITALENTA
                        </Link>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-6 text-sm text-white/50">
                    <p>
                        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}