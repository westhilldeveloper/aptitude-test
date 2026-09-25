'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ActiveTest() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const finishedRef = useRef(false);

  // Load from sessionStorage
  useEffect(() => {
    const qs = JSON.parse(sessionStorage.getItem('questions') || '[]');
    const cand = JSON.parse(sessionStorage.getItem('candidate') || '{}');
    if (!qs.length || !cand.firstName) {
      router.push('/test');
      return;
    }
    setQuestions(qs);
    setCandidate(cand);
    setTimeLeft(qs[0]?.time_limit_seconds || 60);
  }, [router]);

  const finishTest = useCallback(
    async (finalAnswers) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setIsSubmitting(true);
      clearInterval(timerRef.current);

      const payload = {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        dob: candidate.dob,
        answers: finalAnswers || [],
      };

      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        sessionStorage.clear();
        router.push(`/test/complete?sessionId=${data.sessionId || ''}`);
      } catch (err) {
        alert('Submission failed. Please contact the administrator.');
        setIsSubmitting(false);
      }
    },
    [candidate, router]
  );

  // Timer per question
  useEffect(() => {
    if (!questions.length || isSubmitting) return;

    startTimeRef.current = Date.now();
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // auto-advance without recording an answer
          setCurrentIndex((idx) => {
            if (idx < questions.length - 1) {
              const nextIdx = idx + 1;
              setSelected(null);
              setTimeLeft(questions[nextIdx]?.time_limit_seconds || 60);
              return nextIdx;
            } else {
              // last question → finish
              finishTest(answers);
              return idx;
            }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions, isSubmitting, answers, finishTest]);

  const handleSubmitAnswer = () => {
    if (!selected) return;
    clearInterval(timerRef.current);

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const newAnswer = {
      questionId: questions[currentIndex].id,
      selectedOption: selected,
      timeTaken,
    };
    const updated = [...answers, newAnswer];
    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelected(null);
      setTimeLeft(questions[nextIdx]?.time_limit_seconds || 60);
    } else {
      finishTest(updated);
    }
  };

  if (!questions.length) {
    return <div className="p-8 text-center">Loading test…</div>;
  }

  const q = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className={`font-bold text-2xl ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
              ⏱ {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <p className="text-lg font-semibold mb-6 text-gray-900">{q.question_text}</p>

          <div className="space-y-3">
            {Object.entries(q.options).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selected === key ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={key}
                  checked={selected === key}
                  onChange={() => setSelected(key)}
                  className="mr-3"
                />
                <span className="font-medium mr-2 text-gray-700">{key}.</span>
                <span className="text-gray-800">{value}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmitAnswer}
          disabled={!selected || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Submitting…'
            : isLast
            ? 'Finish & Submit'
            : 'Submit & Next'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          If the timer expires, the question is skipped automatically.
        </p>
      </div>
    </div>
  );
}