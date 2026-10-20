"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CircleAlert, CloudCheck, Loader2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STEP_HEADINGS } from "@/constants/registration-constant";
import { isFull } from "@/helpers/program-helper";
import { focusFirstInvalidField } from "@/helpers/user/registration-helper";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { useRegistrationHydrated } from "@/hooks/user/use-registration-hydrated";
import { useSubmitRegistration } from "@/hooks/user/use-submit-registration";
import { registrationSchema, validateStep } from "@/schemas/user/registration";
import { useRegistrationStore } from "@/store/registration-store";
import type { Program } from "@/types/program";
import type { CreatedRegistration, RegistrationStep } from "@/types/user/registration";
import { RegistrationStepper } from "./registration-stepper";
import { RegistrationSuccess } from "./registration-success";
import { ConfirmationStep } from "./step-confirmation";
import { PersonalStep } from "./step-personal";
import { ProgramStep } from "./step-program";

const STEPS: RegistrationStep[] = [1, 2, 3];

type RegistrationWizardProps = {
    programs: Program[];
    initialProgramId?: number;
};

function WizardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Memuat formulir" className="space-y-6">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-130 rounded-xl" />
        </div>
    );
}

export function RegistrationWizard({ programs, initialProgramId }: RegistrationWizardProps) {
    const router = useRouter();
    const hydrated = useRegistrationHydrated();
    const { data: user, isError } = useCurrentUser();
    const submitRegistration = useSubmitRegistration();

    const step = useRegistrationStore((state) => state.step);
    const goToStep = useRegistrationStore((state) => state.goToStep);

    const [submitted, setSubmitted] = useState<CreatedRegistration | null>(null);

    useEffect(() => {
        if (isError) router.replace("/login?next=/pendaftaran");
    }, [isError, router]);

    useEffect(() => {
        if (!hydrated || !user) return;
        const { draft, setField } = useRegistrationStore.getState();
        if (!draft.fullName) setField("fullName", user.name);
    }, [hydrated, user]);

    useEffect(() => {
        if (!hydrated) return;
        const { draft, setField } = useRegistrationStore.getState();

        if (initialProgramId) {
            setField("programId", initialProgramId);
        } else if (draft.programId && !programs.some((p) => p.id === draft.programId && !isFull(p))) {
            setField("programId", null);
        }
    }, [hydrated, initialProgramId, programs]);

    function changeStep(next: RegistrationStep) {
        goToStep(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { draft, step: currentStep, setErrors } = useRegistrationStore.getState();

        if (currentStep < 3) {
            const errors = validateStep(currentStep, draft);
            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                focusFirstInvalidField();
                return;
            }
            changeStep((currentStep + 1) as RegistrationStep);
            return;
        }

        for (const target of STEPS) {
            const errors = validateStep(target, draft);
            if (Object.keys(errors).length > 0) {
                goToStep(target);
                setErrors(errors);
                focusFirstInvalidField();
                return;
            }
        }

        submitRegistration.mutate(registrationSchema.parse(draft), {
            onSuccess: (result) => {
                setSubmitted(result);
                useRegistrationStore.getState().reset();
                useRegistrationStore.persist.clearStorage();
            },
        });
    }

    if (submitted) return <RegistrationSuccess registrationCode={submitted.registrationCode} />;
    if (!hydrated) return <WizardSkeleton />;

    const heading = STEP_HEADINGS[step];
    const isLastStep = step === 3;

    return (
        <div className="space-y-4">
            <Card size="sm" className="py-4">
                <CardContent>
                    <RegistrationStepper current={step} onSelect={changeStep} />
                </CardContent>
            </Card>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <CloudCheck className="size-3.5" aria-hidden />
                Isian tersimpan otomatis di perangkat ini
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <Card className="[--card-spacing:--spacing(6)]">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg">{heading.title}</CardTitle>
                        <CardDescription>{heading.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {step === 1 && <PersonalStep email={user?.email} />}
                        {step === 2 && <ProgramStep programs={programs} />}
                        {step === 3 && <ConfirmationStep programs={programs} email={user?.email} />}

                        {isLastStep && submitRegistration.isError && (
                            <Alert variant="destructive">
                                <CircleAlert aria-hidden />
                                <AlertTitle>Pendaftaran gagal dikirim</AlertTitle>
                                <AlertDescription>{submitRegistration.error.message}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>

                    <CardFooter className="justify-between gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            disabled={step === 1 || submitRegistration.isPending}
                            onClick={() => changeStep((step - 1) as RegistrationStep)}
                        >
                            <ArrowLeft data-icon="inline-start" aria-hidden />
                            Sebelumnya
                        </Button>

                        <p className="hidden text-sm text-muted-foreground sm:block">Langkah {step} dari 3</p>

                        <Button type="submit" size="lg" disabled={submitRegistration.isPending}>
                            {isLastStep ? (
                                <>
                                    {submitRegistration.isPending ? (
                                        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
                                    ) : (
                                        <Send data-icon="inline-start" aria-hidden />
                                    )}
                                    {submitRegistration.isPending ? "Mengirim..." : "Kirim pendaftaran"}
                                </>
                            ) : (
                                <>
                                    Lanjutkan
                                    <ArrowRight data-icon="inline-end" aria-hidden />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
