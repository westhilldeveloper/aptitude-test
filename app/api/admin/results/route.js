import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, first_name, last_name, dob, started_at, completed_at,
             total_questions, score, percentage, status
      FROM test_sessions
      ORDER BY started_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/admin/results error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}