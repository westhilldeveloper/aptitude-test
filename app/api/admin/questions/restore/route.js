import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const [row] = await sql`
      UPDATE questions
      SET is_active = TRUE, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `;
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Restore failed' }, { status: 500 });
  }
}