import { redis } from "./redis";

export interface CachedProfile {
  fullName: string;
  avatarUrl: string | null;
}

const TTL_SECONDS = 60 * 60; // 1 hora

function key(userId: string) {
  return `profile:${userId}`;
}

export async function getCachedProfile(
  userId: string
): Promise<CachedProfile | null> {
  if (!redis) return null;
  try {
    return await redis.get<CachedProfile>(key(userId));
  } catch {
    return null;
  }
}

export async function setCachedProfile(
  userId: string,
  profile: CachedProfile
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key(userId), profile, { ex: TTL_SECONDS });
  } catch {
    // Falha silenciosa — o app continua funcional sem cache
  }
}

export async function invalidateCachedProfile(userId: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key(userId));
  } catch {
    // Falha silenciosa
  }
}
