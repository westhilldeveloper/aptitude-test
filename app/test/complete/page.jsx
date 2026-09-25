'use client';
import Link from 'next/link';

export default function TestComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Test Submitted Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          Your responses have been recorded. The results will be reviewed by the
          administrator and communicated to you.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}