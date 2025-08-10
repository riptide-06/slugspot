// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import MarketingHero from "@/components/MarketingHero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import SlugPicks from "@/components/SlugPicks";
import TrustedReviews from "@/components/TrustedReviews";
import CTABanner from "@/components/CTABanner";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.replace("/listings"); // logged-in? go to the app
      }
    })();
  }, [router]);

  return (
    <>
      <MarketingHero />
      <About />
      <HowItWorks />
      {/* Compass-to-Campus row is embedded in MarketingHero (top) */}
      <TrustedReviews />
      <SlugPicks />
      <CTABanner />
    </>
  );
}

