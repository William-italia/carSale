import type { Request } from 'express';

export function extractTokenFromHeader(req: Request): string | undefined {
  const authAutorization = req.headers?.authorization;

  if (!authAutorization || typeof authAutorization !== 'string') return;

  const [type, token] = authAutorization.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
