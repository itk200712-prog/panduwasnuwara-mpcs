import Link from "next/link";
import { Home, Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-navy-950 px-4">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="relative text-center">
        <p className="text-8xl font-extrabold text-gold-500">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
        <p className="mt-3 text-white/70">
          ඔබ සොයන පිටුව හමු නොවීය. — The page you are looking for does not exist.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonStyles("gold", "lg")}>
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link href="/contact" className={buttonStyles("outlineLight", "lg")}>
            <Search className="h-5 w-5" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
