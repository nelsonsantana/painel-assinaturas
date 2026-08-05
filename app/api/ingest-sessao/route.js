// app/api/ingest-sessao/route.js
//
// Chamado pelo robô (VM ou script local) toda vez que uma renovação de
// sessão dá certo — seja pelo botão "Renovar sessão" (noVNC) ou pelo
// login-manual.js rodado no PC. Guarda só o timestamp, pra mostrar
// "Sessão renovada em ..." no painel.

import { NextResponse } from 'next/server';
import { redis, SESSAO_RENOVADA_KEY } from '../../../lib/redis';

export async function POST(request) {
  const secretRecebido = request.headers.get('x-ingest-secret');

  if (secretRecebido !== process.env.INGEST_SECRET) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();
  await redis.set(SESSAO_RENOVADA_KEY, body.renovadoEm || new Date().toISOString());

  return NextResponse.json({ ok: true });
}
