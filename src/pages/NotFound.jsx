import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center text-white">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-sky-400">404</h1>
        <p className="text-2xl font-semibold">Page Not Found</p>
        <p className="max-w-md text-sm text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
      >
        Go Back Home
      </Link>
    </div>
  )
}
