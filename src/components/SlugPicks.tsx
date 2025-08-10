export default function SlugPicks() {
  const picks = [
    { title: "Kresge Garden", blurb: "Quiet, green, perfect for reading." },
    { title: "Cafe Iveta", blurb: "Espresso + croissants near campus." },
    { title: "S&E Library", blurb: "Reliable Wi‑Fi and study rooms." },
  ];
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Slug Picks of the Month</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {picks.map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="h-32 rounded-lg bg-slate-100 mb-3" />
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-slate-600">{p.blurb}</p>
              <div className="mt-3 text-right">
                <a href="/login" className="text-brand underline text-sm">Log in to see more →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

