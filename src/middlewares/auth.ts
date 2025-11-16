import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Role } from '@/config/enum';
import { getUserById, getUserIdFromRequest } from '@/services/users/service';

export async function requireAuth(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserById(userId);
  if (!user) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return user;
}

export async function requireRole(req: NextRequest, roles: Role[]) {
  const user = await requireAuth(req);
  if (!roles.includes(user.role as Role)) {
    throw NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return user;
}

export async function requireAdmin(req: NextRequest) {
  return requireRole(req, [Role.ADMIN]);
}
