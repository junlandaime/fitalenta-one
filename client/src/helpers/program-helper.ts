import type { Program } from "@/types/program";

export function isFull(p: Program) {
    if (p.status === "full") return true;
    return p.capacity != null && p.currentParticipants != null && p.currentParticipants >= p.capacity;
}

export function quotaLabel(p: Program) {
    if (p.capacity == null) return "-";
    return p.currentParticipants != null ? `${p.currentParticipants} / ${p.capacity}` : `${p.capacity} peserta`;
}

export function quotaPercent(p: Program) {
    if (!p.capacity || p.currentParticipants == null) return undefined;
    return Math.min(100, Math.round((p.currentParticipants / p.capacity) * 100));
}

export function totalEstimate(p: Program) {
    const sum = Number(p.trainingCost ?? 0) + Number(p.departureCost ?? 0);
    return Number.isNaN(sum) ? undefined : sum;
}

export function installmentLabel(plan?: string | null): string {
    if (!plan || plan.toLowerCase() === "none") return "Bayar Lunas";

    const match = plan.match(/^(\d+)_installments?$/i);
    if (match) return `${match[1]} Cicilan`;

    return plan.replace(/_/g, " ");
}