"use client";

import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { PlaygroundSection } from "@/components/landing/PlaygroundSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TechStackSection />
        <UseCasesSection />
        <PlaygroundSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
