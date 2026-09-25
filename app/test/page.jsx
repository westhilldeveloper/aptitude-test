'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TestEntry() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.dob) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();

      if (!data.questions || data.questions.length === 0) {
        setError('No questions available. Please contact the administrator.');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('candidate', JSON.stringify(form));
      sessionStorage.setItem('questions', JSON.stringify(data.questions));

      router.push('/test/active');
    } catch (err) {
      setError('Could not load test. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
   
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 pb-36">
       <div className="w-32 h-24 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/fn_logo.png"
                  alt="Company Logo"
                  width={106}
                  height={106}
                  priority
                  className="object-contain"
                  sizes="96px"
                />
              </div>
      <form onSubmit={handleStart} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
          Candidate Aptitude Test
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your details to begin.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="First Name"
          required
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full border border-purple-300 p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder="Last Name"
          required
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full border border-purple-300 p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-xs text-purple-500 mb-1">Date of Birth</label>
        <input
          type="date"
          required
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full border border-purple-300 p-2 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Preparing Test...' : 'Start Test'}
        </button>
      </form>
    </div>
    </>
  );
}