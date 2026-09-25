'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalSessions: 0,
    completedSessions: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/questions').then((r) => r.json()),
      fetch('/api/admin/results').then((r) => r.json()),
    ]).then(([questions, results]) => {
      setStats({
        totalQuestions: Array.isArray(questions) ? questions.length : 0,
        totalSessions: Array.isArray(results) ? results.length : 0,
        completedSessions: Array.isArray(results)
          ? results.filter((r) => r.status === 'completed').length
          : 0,
      });
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Questions" value={stats.totalQuestions} color="blue" />
        <StatCard label="Total Attempts" value={stats.totalSessions} color="purple" />
        <StatCard label="Completed Tests" value={stats.completedSessions} color="green" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/questions"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Manage Questions
          </h2>
          <p className="text-sm text-gray-500">
            Add, edit, or delete MCQs. Each question has four options and one correct answer.
          </p>
        </Link>

        <Link
          href="/admin/results"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            View Results
          </h2>
          <p className="text-sm text-gray-500">
            See every employee attempt, score, and percentage.
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className={`inline-block px-3 py-1 rounded text-xs font-medium ${colors[color]} mb-3`}>
        {label}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}