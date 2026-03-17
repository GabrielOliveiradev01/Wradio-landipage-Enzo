import { Redis } from "@upstash/redis";

// Redis é opcional — se as variáveis não estiverem definidas, o cache é desabilitado
// e o sistema faz fallback direto ao Supabase.
let redis: Redis | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export { redis };
