export default function About() {
  const features = [
    { title: "Verified Reviews", body: "Only UCSC students can post." },
    { title: "Local Map", body: "Explore campus spots in seconds." },
    { title: "Trusted Community", body: "No spam, no strangers." },
    { title: "Easy Search", body: "Ask anything “Santa Cruz” and get answers." },
  ];
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Why SlugSpot?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-slate-600 mt-1">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

