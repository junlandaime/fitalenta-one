import { api } from "@/lib/axios";
import type {
    CaptchaPayload,
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    ResendVerificationInput,
} from "@/schemas/auth";
import type { AuthUser } from "@/store/auth-store";
import { ApiResponse } from "@/types/api";

type AuthPayload = { user: AuthUser };

export async function login(payload: LoginInput & CaptchaPayload): Promise<AuthPayload> {
    const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/login", payload);
    return data.data;
}

export async function register(payload: RegisterInput & CaptchaPayload): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/register", payload);
    return data.message;
}

export async function verifyEmail(token: string): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/verify-email", { token });
    return data.message;
}

export async function resendVerification(payload: ResendVerificationInput & CaptchaPayload): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/resend-verification", payload);
    return data.message;
}

export async function forgotPassword(payload: ForgotPasswordInput & CaptchaPayload): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/forgot-password", payload);
    return data.message;
}

export async function resetPassword(payload: { token: string; newPassword: string }): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/reset-password", payload);
    return data.message;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<string> {
    const { data } = await api.post<ApiResponse<null>>("/auth/change-password", payload);
    return data.message;
}

export async function logout(): Promise<void> {
    await api.post<ApiResponse<null>>("/auth/logout");
}

export async function fetchCurrentUser(): Promise<AuthUser> {
    const { data } = await api.get<ApiResponse<AuthPayload>>("/auth/me");
    return data.data.user;
}