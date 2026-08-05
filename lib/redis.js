// lib/redis.js
import { Redis } from '@upstash/redis';

// Nomes exatos criados pela integração Upstash na Vercel (com o
// prefixo customizado "UPSTASH_REDIS_REST" que ficou duplicado com o
// nome padrão do Upstash "KV_REST_API_...").
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
});

export const SNAPSHOT_KEY = 'vencimentos:latest';
export const SESSAO_RENOVADA_KEY = 'sessao:renovada-em';