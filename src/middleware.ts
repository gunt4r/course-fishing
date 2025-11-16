import type { NextFetchEvent, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/I18nRouting';
import { isAdmin } from './services/users/service';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const adminPathRegex = /^\/([\w-]+\/)?admin(\/|$)/;

  if (adminPathRegex.test(pathname)) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginUrl = new URL(`/sign-in`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const userIsAdmin = await isAdmin(request);

      if (!userIsAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
  runtime: 'nodejs',
};
