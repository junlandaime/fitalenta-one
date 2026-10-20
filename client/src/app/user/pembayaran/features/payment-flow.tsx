import { Fragment } from "react";
import { ArrowRight, Info, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PAYMENT_FLOW_NOTICE, PAYMENT_FLOW_STEPS } from "@/constants/user/user-payment-constant";

export function PaymentFlow() {
    return (
        <Card className="gap-0 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Workflow className="size-5" aria-hidden />
                </span>
                <div>
                    <h2 className="text-xl font-bold text-primary">Sistem Pembayaran</h2>
                    <p className="text-sm text-muted-foreground">Ketahui alur pembayaran program magang FITALENTA.</p>
                </div>
            </div>

            <ol className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-stretch">
                {PAYMENT_FLOW_STEPS.map(({ title, description, icon: Icon }, index) => (
                    <Fragment key={title}>
                        <li className="relative flex flex-1 flex-col items-center gap-3 rounded-2xl border bg-slate-50/60 px-4 py-5 text-center">
                            <span
                                aria-hidden
                                className="absolute top-3 right-4 text-[10px] font-bold tracking-wider text-slate-400"
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <h3 className="text-sm font-bold text-primary">{title}</h3>
                            <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
                        </li>

                        {index < PAYMENT_FLOW_STEPS.length - 1 && (
                            <li
                                role="presentation"
                                aria-hidden
                                className="hidden items-center text-slate-300 lg:flex"
                            >
                                <ArrowRight className="size-4" />
                            </li>
                        )}
                    </Fragment>
                ))}
            </ol>

            <div
                role="note"
                className="mt-6 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3"
            >
                <Info className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden />
                <div className="space-y-0.5">
                    <p className="text-sm font-bold text-primary">{PAYMENT_FLOW_NOTICE.title}</p>
                    <p className="text-xs text-muted-foreground">{PAYMENT_FLOW_NOTICE.description}</p>
                </div>
            </div>
        </Card>
    );
}
