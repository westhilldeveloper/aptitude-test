import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, dob, answers } = body;

    if (!firstName || !lastName || !dob) {
      return NextResponse.json({ error: 'Missing candidate details' }, { status: 400 });
    }

    const [session] = await sql`
      INSERT INTO test_sessions (first_name, last_name, dob)
      VALUES (${firstName}, ${lastName}, ${dob})
      RETURNING id
    `;
    const sessionId = session.id;

    let correctCount = 0;
    const safeAnswers = Array.isArray(answers) ? answers : [];

    for (const ans of safeAnswers) {
      const [question] = await sql`
        SELECT correct_option FROM questions WHERE id = ${ans.questionId}
      `;
      if (!question) continue;

      const isCorrect = question.correct_option === ans.selectedOption;
      if (isCorrect) correctCount++;

      await sql`
        INSERT INTO answers (session_id, question_id, selected_option,
                             is_correct, time_taken_seconds)
        VALUES (${sessionId}, ${ans.questionId}, ${ans.selectedOption || null},
                ${isCorrect}, ${ans.timeTaken || 0})
        ON CONFLICT (session_id, question_id) DO NOTHING
      `;
    }

    // Total questions = all active questions, so skipped ones count as wrong
    const [{ count: totalActive }] = await sql`
      SELECT COUNT(*)::int AS count FROM questions WHERE is_active = TRUE
    `;

    const percentage =
      totalActive > 0 ? ((correctCount / totalActive) * 100).toFixed(2) : '0.00';

    await sql`
      UPDATE test_sessions
      SET completed_at = NOW(),
          total_questions = ${totalActive},
          score = ${correctCount},
          percentage = ${percentage},
          status = 'completed'
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ sessionId, message: 'Test submitted' });
  } catch (error) {
    console.error('POST /api/submit error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}