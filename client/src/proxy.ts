import { NextResponse, type NextRequest } from "next/server";
import { getHomeByRole, normalizeRole, type AuthRole } from "@/lib/auth-role";

const API_URL = process.env.INTERNAL_API_URL || "http://127.0.0.1:5000/api";

async function getSessionRole(request: NextRequest): Promise<AuthRole | null> {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { cookie: request.headers.get("cookie") ?? "" },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return null;

        const json = await res.json();
        const role = json?.data?.user?.role;
        return role ? normalizeRole(role) : null;
    } catch {
        return null;
    }
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

    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL(getHomeByRole(role), request.url));
    }

    if (pathname.startsWith("/editor") && role === "user") {
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
