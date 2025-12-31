import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await query('SELECT 1');
    return NextResponse.json({ status: 'ok', message: 'Database connected' });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    );
  }
}

