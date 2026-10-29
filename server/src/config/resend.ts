import { Resend } from "resend";

let instance: Resend | null = null;

export function getResendClient(): Resend | null {
  if (instance) return instance;
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_dummy_key_for_dev") {
    return null;
  }
  instance = new Resend(key);
  return instance;
}

export default getResendClient;
