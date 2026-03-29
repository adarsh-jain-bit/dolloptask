import { parse } from 'cookie';

export function parseAuthCookie(cookieHeader) {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  return cookies.authToken || null;
}