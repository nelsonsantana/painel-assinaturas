// app/api/login/route.js
import { NextResponse } from 'next/server';
import { senhaCorreta, tokenEsperado, COOKIE_NAME } from '../../../lib/auth';

export async function POST(request) {
  const { senha } = await request.json();

  if (!senhaCorreta(senha)) {
    return NextResponse.json({ ok: false, erro: 'Senha incorreta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, tokenEsperado(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  });
  return res;
}
