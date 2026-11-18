import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceItem } from "@/types/service";
import { ServiceIcon } from "./service-icon";

export function ServiceCard({ service }: { service: ServiceItem }) {
    return (
        <article className="group relative z-0 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary before:absolute before:inset-0 before:z-0 before:origin-top before:scale-y-0 before:bg-primary before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
            
            {/* Animasi */}
            <style>{`
                @keyframes float-sway {
                    0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
                    50% { transform: translateY(-5px) rotate(5deg) scale(1.05); }
                }
                @keyframes hover-bounce {
                    0%, 100% { transform: translateY(-2px) rotate(-6deg) scale(1.15); }
                    50% { transform: translateY(-8px) rotate(6deg) scale(1.2); }
                }
                .animate-cool-icon {
                    display: inline-flex;
                    animation: float-sway 3.5s ease-in-out infinite;
                    transition: all 0.3s ease-in-out;
                }
                .group:hover .animate-cool-icon {
                    animation: hover-bounce 1.2s ease-in-out infinite;
                    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
                }
            `}</style>

            {/* relative */}
            <div className="relative z-10 mb-5 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20 group-hover:text-white group-hover:shadow-md">
                <span className="animate-cool-icon">
                    <ServiceIcon name={service.icon} />
                </span>
            </div>
            
            <h3 className="relative z-10 mb-3 text-xl font-bold text-primary transition-colors duration-300 group-hover:text-white">
                {service.title}
            </h3>
            
            <p className="relative z-10 line-clamp-4 text-sm leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-100">
                {service.summary}
            </p>
            
            <div className="relative z-10 mt-auto border-t border-slate-100 pt-5 transition-colors duration-300 group-hover:border-white/20">
                <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary group-hover:bg-white group-hover:text-primary group-hover:shadow-md"
                >
                    Learn More
                    <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </article>
    );
}