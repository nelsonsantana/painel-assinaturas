// app/api/sessao-remota/iniciar/route.js
//
// Chamado pelo botão "Renovar sessão" no painel. Pede pra VM subir o
// Chrome remoto (Xvfb + x11vnc + noVNC) e devolve o link pra você abrir
// em qualquer navegador e resolver o captcha/código de verificação.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, tokenEsperado } from '../../../../lib/auth';

function estaAutenticado() {
  const cookieStore = cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  return valor === tokenEsperado();
}

export async function POST() {
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
    const resposta = await fetch(`${process.env.SESSAO_REMOTA_URL}/iniciar`, {
      method: 'POST',
      headers: { 'x-renovar-secret': process.env.RENOVAR_SECRET },
      signal: AbortSignal.timeout(30000),
    });

    const dados = await resposta.json();
    return NextResponse.json(dados, { status: resposta.status });
  } catch (err) {
    return NextResponse.json({ ok: false, erro: `Falha ao contactar o servidor: ${err.message}` }, { status: 502 });
  }
}
