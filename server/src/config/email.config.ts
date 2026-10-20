const DEFAULT_CLIENT_URL = "http://localhost:3000";

export const EMAIL_BRAND = {
  name: "FITALENTA",
  company: "PT FAST Indo Talenta",
  website: "fitalenta.co.id",
  websiteUrl: "https://fitalenta.co.id",
  supportEmail: "info@fitalenta.co.id",
  phone: "0811 1011 9273",
  addressLines: ["Gedung Science and Techno Park ITB", "Jl. Ganesa No.15E, Lb. Siliwangi, Kec. Coblong, Bandung 40132"],
  logoPath: "/fitalenta.png",
  colors: {
    header: "#071d40",
    primary: "#0e4a8f",
    accent: "#e84c23",
    heading: "#0b1f3a",
    text: "#334155",
    muted: "#64748b",
    border: "#e2e8f0",
    page: "#f1f5f9",
    surface: "#ffffff",
    soft: "#f8fafc",
  },
  fontStack: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

export function getClientBaseUrl(): string {
  return (process.env.CLIENT_URL || process.env.CORS_ORIGIN || DEFAULT_CLIENT_URL).replace(/\/$/, "");
}

export function getEmailLogoUrl(): string {
  return process.env.EMAIL_LOGO_URL || `${getClientBaseUrl()}${EMAIL_BRAND.logoPath}`;
}
