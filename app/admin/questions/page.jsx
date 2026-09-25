'use client';
import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'A',
  category: 'Quantitative Aptitude',
  time_limit_seconds: 60,
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchQuestions = async () => {
    const res = await fetch('/api/admin/questions');
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/admin/questions/${editingId}`
      : '/api/admin/questions';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage(editingId ? 'Question updated.' : 'Question added.');
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchQuestions();
    } else {
      setMessage('Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  const handleEdit = (q) => {
    setForm({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      category: q.category,
      time_limit_seconds: q.time_limit_seconds,
    });
    setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Question Bank</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="font-semibold mb-4 text-gray-800">
          {editingId ? `Editing question #${editingId}` : 'Add New Question'}
        </h2>

        {message && (
          <div className="mb-3 p-2 bg-blue-50 text-blue-700 rounded text-sm">
            {message}
          </div>
        )}

        <textarea
          placeholder="Question text"
          required
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          className="w-full border border-gray-300 p-2 mb-3 rounded"
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {['a', 'b', 'c', 'd'].map((opt) => (
            <input
              key={opt}
              type="text"
              placeholder={`Option ${opt.toUpperCase()}`}
              required
              value={form[`option_${opt}`]}
              onChange={(e) => setForm({ ...form, [`option_${opt}`]: e.target.value })}
              className="border border-gray-300 p-2 rounded"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <select
            value={form.correct_option}
            onChange={(e) => setForm({ ...form, correct_option: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          >
            {['A', 'B', 'C', 'D'].map((o) => (
              <option key={o} value={o}>
                Correct: {o}
              </option>
            ))}
          </select>

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          >
            <option>Quantitative Aptitude</option>
            <option>Logical Reasoning</option>
            <option>Verbal Ability</option>
            <option>Technical</option>
            <option>General</option>
          </select>

          <input
            type="number"
            min="10"
            max="300"
            value={form.time_limit_seconds}
            onChange={(e) =>
              setForm({ ...form, time_limit_seconds: parseInt(e.target.value) || 60 })
            }
            className="border border-gray-300 p-2 rounded"
            placeholder="Time (sec)"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Update' : 'Add Question'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {questions.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No questions yet. Add your first one above.
          </p>
        )}

       {questions.map((q, index) => (
  <div
    key={q.id}
    className="bg-white p-4 rounded-lg shadow flex items-start gap-4"
  >
    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
      {index + 1}
    </div>

    <div className="flex-1">
      <p className="font-medium text-gray-800">{q.question_text}</p>
      <p className="text-sm text-gray-500 mt-1">
        {q.category} • Correct: {q.correct_option} • {q.time_limit_seconds}s
      </p>
    </div>

    <div className="flex gap-3 shrink-0">
      <button
        onClick={() => handleEdit(q)}
        className="text-blue-600 hover:underline text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(q.id)}
        className="text-red-600 hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  </div>
))}
      </div>
    </div>
  );
}