import { Response } from "express";

export const COOKIE_NAME = "access_token";

function getCookieDomain(): string | undefined {
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN;
  }
  if (process.env.NODE_ENV === "production") {
    return ".fitalenta.co.id";
  }
  return undefined;
}

export function setAuthCookie(res: Response, token: string) {
  const domain = getCookieDomain();
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  const domain = getCookieDomain();
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain,
    path: "/",
  });
}
