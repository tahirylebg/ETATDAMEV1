import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const SESSION_COOKIE = "ed_session";

export function getSessionCookie(): string | undefined {
  return getCookie(SESSION_COOKIE);
}

export function setSessionCookie(sessionId: string, expiresAt: Date) {
  setCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie() {
  deleteCookie(SESSION_COOKIE, { path: "/" });
}
