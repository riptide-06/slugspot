import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function MarketingHero() {
  return (
    <section className="bg-brand text-white">
      {/* Centered search under nav */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-5 pb-4">
        <div className="mx-auto w-full max-w-3xl">
          <div className="bg-white rounded-xl p-2 shadow-card">
            <SearchBar placeholder="Find places or ask a question..." requireAuth />
          </div>
        </div>
      </div>

      {/* Headline + CTA */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center pt-2 pb-8">
        <h1 className="font-extrabold tracking-tight text-[22px] sm:text-[28px]">
          SLUGSPOT: a campus compass, powered by slugs
        </h1>
        <p className="mt-2 text-white/90 text-sm sm:text-base">
          find the best coffee, study spots, events all around you
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <Link href="/signup" className="rounded-md bg-white text-brand px-5 py-2 font-medium shadow-card">
            Get Started
          </Link>
          <span className="hidden sm:inline text-white/80 text-sm">
            Create an account with your <b>ucsc.edu</b> email to explore
          </span>
        </div>
      </div>
    </section>
  );
}

