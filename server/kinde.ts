import {createKindeServerClient, GrantType, type SessionManager, type UserType} from "@kinde-oss/kinde-typescript-sdk";
import {type Context} from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createFactory, createMiddleware } from 'hono/factory'

// Client for authorization code flow
export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN_URL,
  clientId:  process.env.KINDE_CLIENT_ID,
  clientSecret:  process.env.KINDE_CLIENT_SECRET,
  redirectURL: "http://localhost:5173/api/callback",
  logoutRedirectURL: "http://localhost:5173"
});


export const sessionManager= (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax' as const,
    }
    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key)
  },
  async destroySession() {
    ["id_token", "access_token", "refresh_token", "expires_at"].forEach((key) => {
      deleteCookie(c, key);
    });
  }
});

type Env = {
  Variables: {
    user: UserType
  }
}

export const userMiddleWare = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c)
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ error: "Not authenticated" }, 401);
    }
    const user = await kindeClient.getUserProfile(manager);
    c.set("user", user);
    await next()
  } catch (error) {
    console.error("Error in user middleware:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
})