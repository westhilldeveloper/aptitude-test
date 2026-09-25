'use client';
import { useState, useEffect } from 'react';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/results')
      .then((r) => r.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading results…</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Employee Test Results</h1>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-white rounded-lg shadow">
          No test attempts yet.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">DOB</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700">Score</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700">Percentage</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-gray-800">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="p-3 text-gray-600 text-sm">
                    {r.dob ? new Date(r.dob).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 text-center font-medium text-gray-800">
                    {r.score} / {r.total_questions}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        Number(r.percentage) >= 70
                          ? 'bg-green-100 text-green-800'
                          : Number(r.percentage) >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.percentage}%
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-gray-600">{r.status}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {r.completed_at
                      ? new Date(r.completed_at).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}