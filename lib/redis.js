// lib/redis.js
import { Redis } from '@upstash/redis';

// As duas variáveis abaixo vêm automaticamente quando você conecta um
// banco Upstash Redis ao seu projeto na Vercel (aba Storage).
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const SNAPSHOT_KEY = 'vencimentos:latest';
