import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'bowhdp_super_secret_key_change_in_prod');

export async function GET(req: Request) {
  try {
    const tokenCookie = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('auth_token='));
    if (!tokenCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const token = tokenCookie.split('=')[1];
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
