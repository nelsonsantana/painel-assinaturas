// app/api/verificar/route.js
//
// Chamado pelo botão "Verificar agora" no painel. Roda no servidor da
// Vercel (nunca no navegador do usuário), só repassa a chamada pro
// servidor rodando na VM, que executa o fluxo completo (exporta a
// planilha do painel, calcula vencimentos, manda o Telegram e atualiza
// os dados deste painel via /api/ingest).

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, tokenEsperado } from '../../../lib/auth';

function estaAutenticado() {
  const cookieStore = cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  return valor === tokenEsperado();
}

export async function POST() {
  if (!estaAutenticado()) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 });
  }

  if (!process.env.VERIFICAR_URL || !process.env.RENOVAR_SECRET) {
    return NextResponse.json(
      { ok: false, erro: 'VERIFICAR_URL/RENOVAR_SECRET não configurados no servidor' },
      { status: 500 }
    );
  }

  try {
    const resposta = await fetch(process.env.VERIFICAR_URL, {
      method: 'POST',
      headers: { 'x-renovar-secret': process.env.RENOVAR_SECRET },
      // O fluxo completo (exportar planilha + verificar + Telegram) pode
      // levar bem mais que o padrão do botão "Renovar".
      signal: AbortSignal.timeout(120000),
    });

    const dados = await resposta.json();
    return NextResponse.json(dados, { status: resposta.status });
  } catch (err) {
    return NextResponse.json({ ok: false, erro: `Falha ao contactar o servidor: ${err.message}` }, { status: 502 });
  }
}
