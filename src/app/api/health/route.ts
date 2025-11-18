import { getDataSource } from '@/libs/DB';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ds = await getDataSource();
    
    return NextResponse.json({ 
      status: 'ok',
      connected: ds.isInitialized,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { status: 'error', message: (error as Error).message },
      { status: 500 }
    );
  }
}