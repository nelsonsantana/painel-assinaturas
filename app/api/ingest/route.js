// app/api/ingest/route.js
//
// O script local (rodando no seu PC/servidor) manda um POST aqui
// depois de calcular os vencimentos, autenticado com um header
// x-ingest-secret que só ele e este endpoint conhecem.

import { NextResponse } from 'next/server';
import { redis, SNAPSHOT_KEY } from '../../../lib/redis';

export async function POST(request) {
  const secretRecebido = request.headers.get('x-ingest-secret');

  if (secretRecebido !== process.env.INGEST_SECRET) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 });
  }

  const body = await request.json();

  const snapshot = {
    geradoEm: new Date().toISOString(),
    vencidos: body.vencidos || [],
    urgente: body.urgente || [],
    atencao: body.atencao || [],
  };

  await redis.set(SNAPSHOT_KEY, snapshot);

  return NextResponse.json({ ok: true });
}
