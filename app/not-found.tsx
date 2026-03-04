import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
        <Link href="/">
          <Image src="/logo/logo_black.svg" alt="234Grammar" width={50} height={50} className="w-36" />
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primaryHover transition"
          >
            Go to Home
          </Link>
          <Link
            href="/editor"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition"
          >
            Open Editor
          </Link>
        </div>
      </div>
    </div>
  );
}
