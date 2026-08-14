import { UserRole } from '@prisma/client';

export interface AuthSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export function verifyPermission(role: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    SUPER_ADMIN: 3,
    ADMIN: 2,
    EDITOR: 1,
  };
  return hierarchy[role] >= hierarchy[requiredRole];
}

export function parseBearerToken(authHeader?: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
