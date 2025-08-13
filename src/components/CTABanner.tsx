export default function CTABanner() {
  return (
    <section className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">Your Campus Compass is Waiting</h2>
        <p className="mt-2 text-white/90">Sign up to access trusted reviews, maps, and more.</p>
        <div className="mt-4">
          <a href="/signup" className="inline-block rounded-md bg-white text-brand px-6 py-2 font-medium shadow-card">Sign Up Now</a>
        </div>
      </div>
    </section>
  );
}

