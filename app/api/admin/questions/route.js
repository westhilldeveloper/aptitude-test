import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const questions = await sql`
      SELECT * FROM questions ORDER BY created_at DESC
    `;
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET /api/admin/questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const b = await request.json();
    const [row] = await sql`
      INSERT INTO questions
        (question_text, option_a, option_b, option_c, option_d,
         correct_option, category, time_limit_seconds)
      VALUES
        (${b.question_text}, ${b.option_a}, ${b.option_b}, ${b.option_c},
         ${b.option_d}, ${b.correct_option}, ${b.category || 'General'},
         ${b.time_limit_seconds || 60})
      RETURNING *
    `;
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/questions error:', error);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }
}