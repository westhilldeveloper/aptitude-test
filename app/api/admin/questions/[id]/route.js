import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;          // ✅ await params
    const b = await request.json();

    const [row] = await sql`
      UPDATE questions
      SET question_text = ${b.question_text},
          option_a = ${b.option_a},
          option_b = ${b.option_b},
          option_c = ${b.option_c},
          option_d = ${b.option_d},
          correct_option = ${b.correct_option},
          category = ${b.category},
          time_limit_seconds = ${b.time_limit_seconds},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!row) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error('PUT /api/admin/questions/[id] error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;          // ✅ await params

    const result = await sql`
      DELETE FROM questions WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: result[0].id });
  } catch (error) {
    console.error('DELETE /api/admin/questions/[id] error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}