// app/api/sessao-remota/status/route.js
//
// Consultado pelo painel enquanto espera você terminar o login na aba do
// navegador remoto, pra saber quando pode avisar "sessão renovada".

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, tokenEsperado } from '../../../../lib/auth';

function estaAutenticado() {
  const cookieStore = cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  return valor === tokenEsperado();
}

export async function GET() {
  if (!estaAutenticado()) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 });
  }

  if (!process.env.SESSAO_REMOTA_URL || !process.env.RENOVAR_SECRET) {
    return NextResponse.json(
      { ok: false, erro: 'SESSAO_REMOTA_URL/RENOVAR_SECRET não configurados no servidor' },
      { status: 500 }
    );
  }

  try {
    const resposta = await fetch(`${process.env.SESSAO_REMOTA_URL}/status`, {
      headers: { 'x-renovar-secret': process.env.RENOVAR_SECRET },
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    const dados = await resposta.json();
    return NextResponse.json(dados, { status: resposta.status });
  } catch (err) {
    return NextResponse.json({ ok: false, erro: `Falha ao contactar o servidor: ${err.message}` }, { status: 502 });
  }
}
