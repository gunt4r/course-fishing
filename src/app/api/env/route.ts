import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: !!process.env.DATABASE_URL,
    PGHOST: process.env.PGHOST || null,
    PGPORT: process.env.PGPORT || null,
    PGUSER: process.env.PGUSER || null,
    PGDATABASE: process.env.PGDATABASE || null,
    PORT: process.env.PORT || null,
    NODE_ENV: process.env.NODE_ENV || null,
  });
}
