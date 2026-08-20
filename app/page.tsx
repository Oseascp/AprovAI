"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { EditalAnalyzer } from "@/components/EditalAnalyzer";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { SimuladoInteractive } from "@/components/SimuladoInteractive";
import { Testimonials } from "@/components/Testimonials";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { AITutorModal } from "@/components/AITutorModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { EssayCorrectorModal } from "@/components/EssayCorrectorModal";
import { PlanType } from "@/lib/stripe";

export default function Home() {
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorTopic, setTutorTopic] = useState("");
  const [tutorDiscipline, setTutorDiscipline] = useState("");

  const [isEssayOpen, setIsEssayOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType>("anual");

  const [isProMember, setIsProMember] = useState(false);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenTutorWithTopic = (topic: string, discipline: string) => {
    setTutorTopic(topic);
    setTutorDiscipline(discipline);
    setIsTutorOpen(true);
  };

  const handleOpenCheckout = (plan: PlanType = "anual") => {
    setCheckoutPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleProSuccess = () => {
    setIsProMember(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onOpenAnalyzer={() => scrollToSection("analisador-edital")}
        onOpenCheckout={handleOpenCheckout}
        onOpenTutor={() => setIsTutorOpen(true)}
        onOpenSimulado={() => scrollToSection("simulado-section")}
        onOpenEssay={() => setIsEssayOpen(true)}
        isPro={isProMember}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onOpenAnalyzer={() => scrollToSection("analisador-edital")}
          onOpenCheckout={handleOpenCheckout}
          onOpenTutor={() => setIsTutorOpen(true)}
          onOpenSimulado={() => scrollToSection("simulado-section")}
        />

        {/* 2. Interactive Edital Analyzer (Core Product) */}
        <EditalAnalyzer
          onOpenTutorWithTopic={handleOpenTutorWithTopic}
          onOpenSimuladoWithTopic={(disc, top) => {
            scrollToSection("simulado-section");
          }}
          onOpenCheckout={() => handleOpenCheckout("anual")}
        />

        {/* 3. How It Works (3 Steps) */}
        <HowItWorks
          onOpenAnalyzer={() => scrollToSection("analisador-edital")}
        />

        {/* 4. Features & Competitive Advantage */}
        <FeaturesGrid
          onOpenTutor={() => setIsTutorOpen(true)}
          onOpenSimulado={() => scrollToSection("simulado-section")}
          onOpenCheckout={() => handleOpenCheckout("anual")}
        />

        {/* 5. Interactive Simulado with AI Questions */}
        <SimuladoInteractive
          initialDiscipline="Direito Constitucional"
          initialTopic="Direitos e Garantias Fundamentais"
          onOpenTutor={handleOpenTutorWithTopic}
          onOpenCheckout={() => handleOpenCheckout("anual")}
        />

        {/* 6. Testimonials & Social Proof */}
        <Testimonials />

        {/* 7. Pricing & Plans Section */}
        <PricingSection
          onOpenCheckout={handleOpenCheckout}
          onOpenAnalyzer={() => scrollToSection("analisador-edital")}
        />

        {/* 8. FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating / Dialog Interactive AI Tutor Modal */}
      <AITutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        initialTopic={tutorTopic}
        initialDiscipline={tutorDiscipline}
        onOpenCheckout={() => {
          setIsTutorOpen(false);
          handleOpenCheckout("anual");
        }}
      />

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialPlan={checkoutPlan}
        onSuccess={handleProSuccess}
      />

      {/* Interactive Essay & Discursive Corrector Modal */}
      <EssayCorrectorModal
        isOpen={isEssayOpen}
        onClose={() => setIsEssayOpen(false)}
        onOpenCheckout={() => {
          setIsEssayOpen(false);
          handleOpenCheckout("anual");
        }}
      />
    </div>
  );
}
