import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { redirect } from 'next/navigation';

// Helper to get the JWT secret key
export function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET || 'harmony-secure-secret-key';
  return new TextEncoder().encode(secret);
}

// Verify token and return payload
export async function verifyAuth() {
  const cookieStore = cookies();
  
  const token = cookieStore.get('harmony_auth_token');
  
  if (!token) {
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(
      token.value,
      getJwtSecretKey()
    );
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Create a new token
export async function signToken(payload: any) {
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