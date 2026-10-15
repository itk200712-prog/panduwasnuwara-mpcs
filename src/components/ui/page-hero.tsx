export function PageHero({ badge, title, text }: { badge: string; title: string; text?: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="container-page relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-300">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {badge}
        </span>
        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {text && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{text}</p>}
      </div>
    </section>
  );
}
