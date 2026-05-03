import { createFileRoute } from "@tanstack/react-router";

import { FeaturesSection } from "./-components/features-section";
import { HeroSection } from "./-components/hero-section";
import { HowItWorksSection } from "./-components/how-it-works-section";
import { ProblemSection } from "./-components/problem-section";
import { RiskEngineSection } from "./-components/risk-engine-section";
import { SolanaSection } from "./-components/solana-section";
import { WaitlistSection } from "./-components/waitlist-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="bg-background text-foreground relative min-h-svh">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <RiskEngineSection />
      <SolanaSection />
      <WaitlistSection />
    </main>
  );
}
