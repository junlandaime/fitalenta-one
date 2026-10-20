"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const TRICKLE_MS = 200;
const MAX_WAIT_MS = 10_000;

export function RouteProgress() {
    const pathname = usePathname();
    const search = useSearchParams().toString();

    const barRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef(0);
    const trickleRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const hideRef = useRef<number | null>(null);

    const paint = useCallback((value: number, visible: boolean) => {
        const bar = barRef.current;
        if (!bar) return;
        bar.style.transform = `scaleX(${value})`;
        bar.style.opacity = visible ? "1" : "0";
    }, []);

    const clearTimers = useCallback(() => {
        if (trickleRef.current !== null) window.clearInterval(trickleRef.current);
        if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
        if (hideRef.current !== null) window.clearTimeout(hideRef.current);
        trickleRef.current = timeoutRef.current = hideRef.current = null;
    }, []);

    const finish = useCallback(() => {
        if (trickleRef.current === null) return;
        clearTimers();
        paint(1, true);
        hideRef.current = window.setTimeout(() => paint(1, false), 250);
    }, [clearTimers, paint]);

    const start = useCallback(() => {
        clearTimers();
        const bar = barRef.current;
        if (!bar) return;

        bar.style.transition = "none";
        valueRef.current = 0.08;
        paint(valueRef.current, true);
        void bar.offsetWidth;
        bar.style.transition = "";

        trickleRef.current = window.setInterval(() => {
            valueRef.current += (0.9 - valueRef.current) * 0.12;
            paint(valueRef.current, true);
        }, TRICKLE_MS);
        timeoutRef.current = window.setTimeout(finish, MAX_WAIT_MS);
    }, [clearTimers, finish, paint]);

    useEffect(() => {
        finish();
    }, [pathname, search, finish]);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = (event.target as Element | null)?.closest?.("a");
            if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) return;
            if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname && url.search === window.location.search) return;

            start();
        };

        document.addEventListener("click", onClick, true);
        return () => {
            document.removeEventListener("click", onClick, true);
            clearTimers();
        };
    }, [start, clearTimers]);

    return (
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.75">
            <div
                ref={barRef}
                style={{ transform: "scaleX(0)", opacity: 0 }}
                className="h-full origin-left bg-secondary shadow-[0_0_10px_var(--color-secondary)] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
            />
        </div>
    );
}
