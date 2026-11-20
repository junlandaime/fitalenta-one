import { NextResponse, type NextRequest } from "next/server";
import { getHomeByRole, normalizeRole, type AuthRole } from "@/lib/auth-role";
import { createHash } from "node:crypto";

const API_URL = process.env.INTERNAL_API_URL || "http://127.0.0.1:5000/api";
const SESSION_CACHE_TTL_MS = 20_000;
const SESSION_CACHE_MAX_ENTRIES = 256;
const sessionCache = new Map<string, { role: AuthRole; expiresAt: number }>();
const sessionRequests = new Map<string, Promise<AuthRole | null>>();

async function getSessionRole(request: NextRequest): Promise<AuthRole | null> {
    const cookies = request.headers.get("cookie") ?? "";
    const token = cookies
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("access_token="))
        ?.slice("access_token=".length);

    if (!token) return null;

    const cacheKey = createHash("sha256").update(token).digest("hex");
    const cached = sessionCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.role;
    sessionCache.delete(cacheKey);

    const pending = sessionRequests.get(cacheKey);
    if (pending) return pending;

    const sessionRequest = (async () => {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { cookie: request.headers.get("cookie") ?? "" },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return null;

        const json = await res.json();
        const role = json?.data?.user?.role;
        if (!role) return null;

        const normalizedRole = normalizeRole(role);
        sessionCache.set(cacheKey, {
            role: normalizedRole,
            expiresAt: Date.now() + SESSION_CACHE_TTL_MS,
        });

        if (sessionCache.size > SESSION_CACHE_MAX_ENTRIES) {
            const oldestKey = sessionCache.keys().next().value;
            if (oldestKey) sessionCache.delete(oldestKey);
        }

        return normalizedRole;
    } catch {
        return null;
    }
    })();

    sessionRequests.set(cacheKey, sessionRequest);
    void sessionRequest.finally(() => sessionRequests.delete(cacheKey));
    return sessionRequest;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const role = await getSessionRole(request);

    if (pathname === "/login" || pathname === "/register") {
        return role
            ? NextResponse.redirect(new URL(getHomeByRole(role), request.url))
            : NextResponse.next();
    }

    if (!role) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    if (pathname.startsWith("/admin") && role !== "admin" && role !== "superadmin") {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    if (pathname.startsWith("/editor") && role !== "editor" && role !== "admin" && role !== "superadmin") {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    if (pathname.startsWith("/user") && role !== "user") {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/admin/:path*", "/editor/:path*", "/user/:path*", "/dashboard/:path*"],
};
