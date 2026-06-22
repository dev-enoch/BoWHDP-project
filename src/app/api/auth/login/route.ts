import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'bowhdp_super_secret_key_change_in_prod');

export async function POST(req: Request) {
  try {
    const { email, password, demoRole } = await req.json();

    // In a real system, we'd look up the user by email and verify the password hash in MongoDB.
    // For this prototype, we'll allow the demoRole quick-login to bypass standard auth.
    
    let user = null;

    if (demoRole === 'Admin') {
      user = { id: 'U-001', name: 'Engr. Zulum (Admin)', email: 'admin@bowhdp.gov.ng', role: 'Admin' };
    } else if (demoRole === 'Engineer') {
      user = { id: 'E-402', name: 'Engr. Abubakar', email: 'field@bowhdp.gov.ng', role: 'Engineer' };
    } else {
      // Standard login logic placeholder
      if (email === 'admin@bowhdp.gov.ng' && password === 'password') {
        user = { id: 'U-001', name: 'Engr. Zulum (Admin)', email: email, role: 'Admin' };
      } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Sign the JWT
    const token = await new SignJWT({ ...user })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Token expires in 24 hours
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: 'Login successful', user }, { status: 200 });

    // Set the HttpOnly cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
