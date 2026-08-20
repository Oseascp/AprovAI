"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
  BrainCircuit,
  Award,
  Play,
  TrendingUp,
  Target,
} from "lucide-react";
import { PlanType } from "@/lib/stripe";

interface HeroProps {
  onOpenAnalyzer: () => void;
  onOpenCheckout: (plan?: PlanType) => void;
  onOpenTutor: () => void;
  onOpenSimulado: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAnalyzer,
  onOpenCheckout,
  onOpenTutor,
  onOpenSimulado,
}) => {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<
    "plano" | "tutor" | "simulado"
  >("plano");

  const certames = [
    { name: "TJ-SP", desc: "Vunesp • 100% calibrado" },
    { name: "INSS", desc: "Cebraspe • Dir. Previdenciário" },
    { name: "Receita Federal", desc: "FGV • Auditor & Analista" },
    { name: "Polícia Federal", desc: "Cebraspe • Agente & Escrivão" },
    { name: "Banco do Brasil", desc: "Cesgranrio • Escriturário" },
    { name: "Caixa Econômica", desc: "Cesgranrio • TI & Comercial" },
    { name: "Polícia Rodoviária (PRF)", desc: "Cebraspe • Legislação" },
  ];

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Proof Badge */}
        <div className="flex justify-center mb-6">
          <div
            id="hero-proof-badge"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Inteligência Artificial Especializada em Concursos Públicos</span>
            <span className="hidden sm:inline text-emerald-600 font-bold">•</span>
            <span className="hidden sm:inline font-bold text-emerald-900">
              +12.000 Aprovados
            </span>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1
            id="hero-main-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
          >
            Seu edital. Seu plano.{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent underline decoration-emerald-300 decoration-wavy decoration-2">
              Sua aprovação.
            </span>
          </h1>

          <p
            id="hero-main-subtitle"
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal"
          >
            A IA que disseca seu edital em segundos, prioriza o que realmente
            cai com base na banca organizadora e monta seu{" "}
            <strong className="text-slate-800 font-semibold">
              cronograma de estudos diário personalizado
            </strong>{" "}
            até o dia da prova.
          </p>

          {/* Primary Action Buttons */}
          <div
            id="hero-cta-buttons"
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="hero-btn-start-analyzer"
              onClick={onOpenAnalyzer}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Analisar Meu Edital Grátis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-explore-pro"
              onClick={() => onOpenCheckout("anual")}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Garantir AprovAI PRO</span>
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                -33%
              </span>
            </button>
          </div>

          {/* Value Highlights */}
          <div
            id="hero-trust-bullets"
            className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Análise em menos de 30s
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sem necessidade de cartão para testar
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Garantia incondicional de 7 dias
            </span>
          </div>
        </div>

        {/* Product Mockup Showcase with Interactive Features */}
        <div
          id="hero-product-mockup"
          className="relative max-w-5xl mx-auto mt-6 rounded-2xl sm:rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-slate-200/80 to-slate-300/60 border border-slate-300 shadow-2xl"
        >
          {/* Browser / App Frame Header */}
          <div className="bg-slate-900 rounded-t-xl sm:rounded-t-2xl px-4 py-3 flex items-center justify-between text-slate-400 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">
                aprovai.com.br/dashboard/plano-tj-sp-vunesp
              </span>
            </div>

            {/* Interactive Live Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs font-medium">
              <button
                id="mockup-tab-plano"
                onClick={() => setActiveInteractiveTab("plano")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeInteractiveTab === "plano"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Cronograma Inteligente
              </button>
              <button
                id="mockup-tab-tutor"
                onClick={() => {
                  setActiveInteractiveTab("tutor");
                  onOpenTutor();
                }}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  activeInteractiveTab === "tutor"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" /> Tutor IA
              </button>
              <button
                id="mockup-tab-simulado"
                onClick={() => {
                  setActiveInteractiveTab("simulado");
                  onOpenSimulado();
                }}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  activeInteractiveTab === "simulado"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <BookOpen className="w-3 h-3" /> Simulado
              </button>
            </div>
          </div>

          {/* Main Mockup Image Container */}
          <div className="relative rounded-b-xl sm:rounded-b-2xl overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-[16/9] w-full group">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUO9mD_G1BxvMIjwOdfww1Eh7VIImi4CYE9cJSc2IISOC7Mp2fdDJn8n9VZFVSmVDhJ5Q7E-LKrpHiN4fqyxuttXSRXaAwHZeQZYG_WO9CAr0C0glAFhR-iRhA1FmHY0iVxWgsUtPTZaL5ckNt5KgoOZU3kg1yTBoUBwZfBA5age9n7Ld3Bh-uMjceIKE5rk8bkBo3N0v0vExiZkp4HPfP3O6if2lYO0QWxBJITFpkgwOxDURjhBi0ow"
              alt="Painel AprovAI - Análise do Edital e Cronograma de Estudos com Inteligência Artificial"
              fill
              priority
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />

            {/* Interactive Floating Badge 1: Progresso Diário */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                85%
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Meta Diária</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-300">
                  Dir. Constitucional + Vunesp
                </p>
              </div>
            </div>

            {/* Interactive Floating Badge 2: Tutor IA */}
            <div
              onClick={onOpenTutor}
              className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-slate-900/90 backdrop-blur-md border border-indigo-500/40 text-white p-3 sm:p-4 rounded-xl shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-indigo-300">Tutor IA Ativo</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300">
                  &quot;Como cai o Art. 5º na banca?&quot;
                </p>
              </div>
            </div>

            {/* Quick Action Overlay Bar on Hover */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-400/30">
                  Edital Concurso TJ-SP
                </span>
                <span className="hidden sm:inline text-slate-400">
                  • 100 Questões • 4 Horas/dia • 12 Semanas
                </span>
              </div>
              <button
                onClick={onOpenAnalyzer}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-colors"
              >
                <span>Experimentar Análise Interativa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Certames and Institutions Marquee / Ticker */}
        <div id="certames-supported-section" className="mt-14 pt-8 border-t border-slate-200">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-600 mb-6">
            Inteligência calibrada para as maiores bancas e concursos do Brasil
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {certames.map((item, idx) => (
              <div
                key={idx}
                onClick={onOpenAnalyzer}
                className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer text-center group"
              >
                <p className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
