"use client";

import { Check } from "lucide-react";
import { REGISTRATION_STEPS } from "@/constants/registration-constant";
import { cn } from "@/lib/utils";
import type { RegistrationStep } from "@/types/user/registration";

type RegistrationStepperProps = {
    current: RegistrationStep;
    onSelect: (step: RegistrationStep) => void;
};

export function RegistrationStepper({ current, onSelect }: RegistrationStepperProps) {
    return (
        <nav aria-label="Langkah pendaftaran">
            <ol className="flex items-center">
                {REGISTRATION_STEPS.map((step, index) => {
                    const done = step.id < current;
                    const active = step.id === current;
                    const isLast = index === REGISTRATION_STEPS.length - 1;

                    return (
                        <li key={step.id} className={cn("flex items-center", !isLast && "flex-1")}>
                            <button
                                type="button"
                                disabled={!done}
                                onClick={() => onSelect(step.id)}
                                aria-current={active ? "step" : undefined}
                                className="flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default"
                            >
                                <span
                                    className={cn(
                                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                                        done && "border-primary bg-primary text-primary-foreground",
                                        active && "border-primary text-primary ring-4 ring-primary/15",
                                        !done && !active && "text-muted-foreground",
                                    )}
                                >
                                    {done ? <Check className="size-4" aria-hidden /> : step.id}
                                </span>
                                <span className="hidden sm:block">
                                    <span className="block text-sm leading-none font-medium">{step.title}</span>
                                    <span className="mt-1 block text-xs text-muted-foreground">{step.description}</span>
                                </span>
                            </button>

                            {!isLast && (
                                <span
                                    aria-hidden
                                    className={cn("mx-3 h-px flex-1 transition-colors", done ? "bg-primary" : "bg-border")}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
