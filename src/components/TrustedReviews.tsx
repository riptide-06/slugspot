export default function TrustedReviews() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-7 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-2.5">Trusted Reviews</h2>
        <ul className="text-slate-700 list-disc pl-5 space-y-1 text-sm sm:text-base mb-4">
          <li>access reviews only from UCSC students</li>
          <li>rate and review your favorite spots with pictures</li>
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { q: "“Stevenson Cafe is the best omg”", a: "— Sai P., sophomore" },
            { q: "“S and E is perfect for studying”", a: "— Sahasra A., sophomore" },
            { q: "“wowwowowowo”", a: "— Matthew, sophomore" },
          ].map((t, i) => (
            <blockquote
              key={i}
              className="rounded-xl bg-white border border-slate-200 p-4 shadow-card text-sm text-slate-800 h-full"
            >
              {t.q}
              <div className="mt-2 text-xs text-slate-500">{t.a}</div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

