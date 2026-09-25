import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link href="/admin" className="font-bold text-lg">
            Admin Panel
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/admin" className="hover:text-blue-300">
              Dashboard
            </Link>
            <Link href="/admin/questions" className="hover:text-blue-300">
              Questions
            </Link>
            <Link href="/admin/results" className="hover:text-blue-300">
              Results
            </Link>
            <Link href="/" className="hover:text-blue-300">
              Employee View
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}