import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center">

        {/* Brand block */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-24 rounded-md bg-white  shadow-sm flex items-center justify-center overflow-hidden">
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
          <p className="mt-3 text-sm font-medium text-gray-500 tracking-wide uppercase">
            Finovest Group
          </p>
        </div>

        <div className="border-t border-gray-100 mb-2" />

        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Candidate Aptitude Test
        </h1>
        <p className="text-gray-600 mb-10">
          A timed MCQ assessment to evaluate quantitative, logical, and verbal skills.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <Link
            href="/test"
            className="block p-6 rounded-xl border-2 border-blue-500 hover:bg-blue-50 transition"
          >
            <div className="text-3xl mb-2">🧑‍💼</div>
            <h2 className="text-xl font-semibold text-blue-700 mb-1">
              Take the Test
            </h2>
            <p className="text-sm text-gray-500">
              Candidate: register and begin the assessment.
            </p>
          </Link>
        </div>

        <div className="mt-10 text-xs text-gray-400">
          Questions shuffle per candidate • Per-question timer • Auto-submit on timeout
        </div>
      </div>
    </main>
  );
}