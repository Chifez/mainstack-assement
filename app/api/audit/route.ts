import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAuditLogs } from '@/lib/db/queries/audit';

export async function GET(request: Request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const entity_type = searchParams.get('entity_type') as any;
    const entity_id = searchParams.get('entity_id');
    const user_id = searchParams.get('user_id');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const logs = await getAuditLogs({
      entity_type,
      entity_id: entity_id || undefined,
      user_id: user_id || undefined,
      date_from: date_from ? new Date(date_from) : undefined,
      date_to: date_to ? new Date(date_to) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json({
      logs: logs.map((log) => ({
        ...log,
        changes:
          typeof log.changes === 'string'
            ? JSON.parse(log.changes)
            : log.changes,
      })),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Failed to get audit logs' },
      { status: 500 }
    );
  }
}
