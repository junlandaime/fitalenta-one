import { CreditCard } from "lucide-react";
import { PAYMENT_HERO, PAYMENT_HERO_CHIPS } from "@/constants/user/user-payment-constant";

export function PaymentHero() {
    return (
        <header className="space-y-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-600 uppercase">
                <CreditCard className="size-3.5" aria-hidden />
                {PAYMENT_HERO.badge}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">{PAYMENT_HERO.title}</h1>

            <p className="mx-auto max-w-2xl text-muted-foreground">{PAYMENT_HERO.subtitle}</p>

            <ul className="flex flex-wrap justify-center gap-3">
                {PAYMENT_HERO_CHIPS.map(({ label, icon: Icon }) => (
                    <li
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-primary shadow-xs"
                    >
                        <Icon className="size-4 text-indigo-600" aria-hidden />
                        {label}
                    </li>
                ))}
            </ul>
        </header>
    );
}
