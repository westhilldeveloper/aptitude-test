import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const questions = await sql`
      SELECT id, question_text, option_a, option_b, option_c, option_d,
             category, time_limit_seconds
      FROM questions
      WHERE is_active = TRUE
      ORDER BY RANDOM()
    `;

    const safeQuestions = questions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      options: {
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d,
      },
      category: q.category,
      time_limit_seconds: q.time_limit_seconds,
    }));

    return NextResponse.json({ questions: safeQuestions });
  } catch (error) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}