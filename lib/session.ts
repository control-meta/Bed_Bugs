import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const SESSION_COOKIE_NAME = "bedbug_admin_session";
const JWT_EXPIRY = "24h";

function getJwtSecret(): Uint8Array {
  // Automatically uses Supabase service role key or internal secure key
  // No need for user to configure ADMIN_JWT_SECRET in .env
  const secret =
    process.env.ADMIN_JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "bedbug-secure-internal-signature-key-2026-production-token";
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(username: string): Promise<string> {
  const secretKey = getJwtSecret();
  return new SignJWT({
    username,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secretKey);
}

export async function verifyAdminToken(
  token: string,
): Promise<{ valid: boolean; username?: string }> {
  try {
    const secretKey = getJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === "admin" && typeof payload.username === "string") {
      return { valid: true, username: payload.username };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}
