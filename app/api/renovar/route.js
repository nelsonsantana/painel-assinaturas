// app/api/renovar/route.js
//
// Chamado pelo botão "Renovar" no painel. Roda no servidor da Vercel
// (nunca no navegador do usuário), então o RENOVAR_SECRET nunca fica
// exposto no cliente. Só repassa a chamada pro servidor rodando na VM.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, tokenEsperado } from '../../../lib/auth';

function estaAutenticado() {
  const cookieStore = cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  return valor === tokenEsperado();
}

export async function POST(request) {
  if (!estaAutenticado()) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 });
  }

  const { conta } = await request.json();
  if (!conta) {
    return NextResponse.json({ ok: false, erro: 'Campo "conta" é obrigatório' }, { status: 400 });
  }

  if (!process.env.RENOVAR_URL || !process.env.RENOVAR_SECRET) {
    return NextResponse.json(
      { ok: false, erro: 'RENOVAR_URL/RENOVAR_SECRET não configurados no servidor' },
      { status: 500 }
    );
  }

  try {
    const resposta = await fetch(process.env.RENOVAR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-renovar-secret': process.env.RENOVAR_SECRET,
      },
      body: JSON.stringify({ conta }),
      // A automação no navegador da VM pode levar bem mais que o padrão.
      signal: AbortSignal.timeout(60000),
    });

    const dados = await resposta.json();
    return NextResponse.json(dados, { status: resposta.status });
  } catch (err) {
    return NextResponse.json({ ok: false, erro: `Falha ao contactar o servidor: ${err.message}` }, { status: 502 });
  }
}
