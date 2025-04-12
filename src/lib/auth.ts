import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { redirect } from 'next/navigation';

// Define a type for the token payload
interface TokenPayload {
  id: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

// Helper to get the JWT secret key
export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || 'harmony-secure-secret-key';
  return new TextEncoder().encode(secret);
}

// Verify token and return payload
export async function verifyAuth() {
  // Reading cookies in a server component/middleware
  let tokenValue: string | undefined;
  
  try {
    // Get token from cookie jar
    // @ts-ignore - Suppress TypeScript error for Next.js cookies() API
    tokenValue = cookies().get?.('harmony_auth_token')?.value;
  } catch (error) {
    console.error('Error reading cookies:', error);
  }
  
  if (!tokenValue) {
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(
      tokenValue,
      getJwtSecretKey()
    );
    
    return payload;
  } catch (_error) {
    return null;
  }
}

// Create a new token
export async function signToken(payload: TokenPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getJwtSecretKey());
    
    return token;
  } catch (error) {
    console.error('Error signing token:', error);
    return null;
  }
}

// Server component to protect routes
export async function requireAuth() {
  const session = await verifyAuth();
  
  if (!session) {
    redirect('/church/login');
  }
  
  return session;
} 