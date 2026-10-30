export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}
