"use client";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import FlowSection from "./FlowSection";
import BlockchainSection from "./BlockchainSection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandigPageClient() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar onScrollToTop={scrollToTop} />
      <HeroSection />
      <ProblemSection />
      <FlowSection />
      <BlockchainSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}
