import { env } from "@/env";
import { APP_SLUG } from "@/utils/constants";
import { UserRole } from "@/utils/models/user";
import * as jose from "jose";
const SECRET = new TextEncoder().encode(env.JOSE_SECRET);
const ALG = "HS256";

const ISSUER = `urn:${APP_SLUG}:issuer`;
const AUDIENCE = `urn:${APP_SLUG}:audience`;

export type TokenPayload = {
  userId: string;
  userEmail: string;
  userRole: UserRole;
};

const defaultExpiresAt = new Date("2099-12-31T23:59:59Z");

export const signToken = (
  payload: TokenPayload,
  expiresAt = defaultExpiresAt
) =>
  new jose.SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(expiresAt)
    .sign(SECRET);

export const verifyToken = async (jwt: string) =>
  jose.jwtVerify<TokenPayload>(jwt, SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
