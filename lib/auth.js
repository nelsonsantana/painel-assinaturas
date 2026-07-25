// lib/auth.js
import crypto from 'crypto';

// Gera um valor de cookie a partir da senha + um segredo do servidor,
// pra não guardar a senha em texto puro no cookie do navegador.
export function tokenEsperado() {
  return crypto
    .createHash('sha256')
    .update(`${process.env.PAGE_PASSWORD}:${process.env.INGEST_SECRET}`)
    .digest('hex');
}

export function senhaCorreta(senhaDigitada) {
  return senhaDigitada === process.env.PAGE_PASSWORD;
}

export const COOKIE_NAME = 'painel_auth';
