"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  BookOpen,
  HelpCircle,
  Award,
  Crown,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  FileEdit,
} from "lucide-react";
import { PlanType } from "@/lib/stripe";

interface NavbarProps {
  onOpenAnalyzer: () => void;
  onOpenCheckout: (plan?: PlanType) => void;
  onOpenTutor: () => void;
  onOpenSimulado: () => void;
  onOpenEssay?: () => void;
  isPro?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAnalyzer,
  onOpenCheckout,
  onOpenTutor,
  onOpenSimulado,
  onOpenEssay,
  isPro = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="brand-logo-container"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Aprov<span className="text-emerald-600">AI</span>
              </span>
              {isPro ? (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Crown className="w-3 h-3 fill-amber-500 text-amber-500" /> PRO
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  IA BETA
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Seu edital. Seu plano. Sua aprovação.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          id="desktop-nav-links"
          className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600"
        >
          <button
            id="nav-link-how-it-works"
            onClick={() => scrollTo("como-funciona")}
            className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Como Funciona
          </button>
          <button
            id="nav-link-features"
            onClick={() => scrollTo("recursos")}
            className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Vantagens
          </button>
          <button
            id="nav-link-tutor"
            onClick={onOpenTutor}
            className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 text-emerald-600 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Tutor IA
          </button>
          <button
            id="nav-link-simulado"
            onClick={onOpenSimulado}
            className="px-3 py-2 rounded-lg hover:text-indigo-700 hover:bg-indigo-50 text-indigo-600 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <BookOpen className="w-4 h-4" />
            Simulado
          </button>
          {onOpenEssay && (
            <button
              id="nav-link-redacao"
              onClick={onOpenEssay}
              className="px-3 py-2 rounded-lg hover:text-amber-700 hover:bg-amber-50 text-amber-600 flex items-center gap-1.5 transition-colors font-semibold"
            >
              <FileEdit className="w-4 h-4" />
              Redação IA
            </button>
          )}
          <button
            id="nav-link-testimonials"
            onClick={() => scrollTo("depoimentos")}
            className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Aprovados
          </button>
          <button
            id="nav-link-pricing"
            onClick={() => scrollTo("planos")}
            className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Planos
          </button>
        </nav>

        {/* Action CTAs */}
        <div id="nav-cta-actions" className="hidden sm:flex items-center gap-3">
          <button
            id="nav-btn-analyze"
            onClick={onOpenAnalyzer}
            className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 transition-colors"
          >
            Analisar Edital
          </button>

          {isPro ? (
            <button
              id="nav-btn-pro-active"
              onClick={onOpenTutor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:brightness-105 transition-all"
            >
              <Crown className="w-4 h-4 fill-white" />
              Painel PRO Ativo
            </button>
          ) : (
            <button
              id="nav-btn-get-pro"
              onClick={() => onOpenCheckout("anual")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-emerald-200" />
              <span>Garantir AprovAI PRO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-btn-analyze-short"
            onClick={onOpenAnalyzer}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white"
          >
            Analisar
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-dropdown"
          className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2"
        >
          <button
            onClick={() => scrollTo("como-funciona")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Como Funciona
          </button>
          <button
            onClick={() => scrollTo("recursos")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Vantagens
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTutor();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Tutor IA 24/7
            </span>
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-md">
              Novo
            </span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSimulado();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-indigo-700 font-semibold bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Simulado da Banca
            </span>
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-md">
              Treinar
            </span>
          </button>
          {onOpenEssay && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEssay();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-amber-700 font-semibold bg-amber-50 hover:bg-amber-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileEdit className="w-4 h-4" /> Corretor de Redação
              </span>
              <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-md">
                Espelho IA
              </span>
            </button>
          )}
          <button
            onClick={() => scrollTo("depoimentos")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Aprovados
          </button>
          <button
            onClick={() => scrollTo("planos")}
            className="w-full text-left px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Planos e Preços
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAnalyzer();
              }}
              className="w-full py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Analisar Meu Edital Grátis
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout("anual");
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Garantir Acesso PRO (33% OFF)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
