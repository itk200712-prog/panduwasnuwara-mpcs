import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[80px] font-extrabold text-indigo-700 leading-none">404</div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Page not found</h1>
        <p className="text-slate-500 text-[13.5px] mt-2">
          ඔබ සොයන පිටුව හමු නොවීය. The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary mt-6 inline-flex">
          Go Home
        </Link>
      </div>
    </main>
  );
}
