export default function HowItWorks() {
  const steps = [
    { n: 1, t: "Sign up", b: "Use your ucsc.edu email." },
    { n: 2, t: "Search & explore", b: "Find verified campus spots fast." },
    { n: 3, t: "Review & share", b: "Help other slugs discover gems." },
  ];
  return (
    <section className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="w-8 h-8 rounded-full bg-brand/10 text-brand grid place-items-center font-bold">{s.n}</div>
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="text-sm text-slate-600">{s.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

