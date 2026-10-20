export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const TURNSTILE_ENABLED = TURNSTILE_SITE_KEY !== "";
export const TURNSTILE_MISCONFIGURED = process.env.NEXT_PUBLIC_REQUIRE_TURNSTILE === "true" && !TURNSTILE_ENABLED;

export const AUTH_ERROR_CODE = {
    emailNotVerified: "EMAIL_NOT_VERIFIED",
    captchaRequired: "CAPTCHA_REQUIRED",
    captchaFailed: "CAPTCHA_FAILED",
} as const;

export const RESEND_COOLDOWN_SECONDS = 60;

export const LOGIN_NOTICES = {
    registered:
        "Pendaftaran diproses. Jika data valid, email verifikasi telah dikirim. Cek inbox atau folder spam, lalu klik tautan verifikasi sebelum login.",
    verified: "Email berhasil diverifikasi. Silakan login.",
    reset: "Password berhasil diubah. Silakan login dengan password baru.",
} as const;

export type LoginNoticeKey = keyof typeof LOGIN_NOTICES;

export function resolveLoginNotice(params: {
    registered?: string;
    verified?: string;
    reset?: string;
}): string | undefined {
    if (params.reset === "1") return LOGIN_NOTICES.reset;
    if (params.verified === "1") return LOGIN_NOTICES.verified;
    if (params.registered === "1") return LOGIN_NOTICES.registered;
    return undefined;
}