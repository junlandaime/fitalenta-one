import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Masukkan email yang valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        name: z.string().min(1, "Nama wajib diisi"),
        email: z
            .string()
            .min(1, "Email wajib diisi")
            .email("Masukkan email yang valid"),
        phone: z
            .string()
            .min(1, "Nomor telepon wajib diisi")
            .min(9, "Nomor telepon terlalu pendek"),
        password: z
            .string()
            .min(1, "Password wajib diisi")
            .min(6, "Password minimal 6 karakter"),
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

export const resendVerificationSchema = z.object({
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Masukkan email yang valid"),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type CaptchaPayload = { turnstileToken?: string };
export const PASSWORD_MIN_LENGTH = 6;

const newPasswordField = z
    .string()
    .min(1, "Password baru wajib diisi")
    .min(PASSWORD_MIN_LENGTH, `Password minimal ${PASSWORD_MIN_LENGTH} karakter`);

export const forgotPasswordSchema = resendVerificationSchema;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        newPassword: newPasswordField,
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
        newPassword: newPasswordField,
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Konfirmasi password tidak cocok",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "Password baru harus berbeda dari password saat ini",
        path: ["newPassword"],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;