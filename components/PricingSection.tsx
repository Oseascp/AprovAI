"use client";

import React, { useState } from "react";
import {
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  Crown,
  Infinity,
  Sparkles,
} from "lucide-react";
import { PlanType } from "@/lib/stripe";

interface PricingSectionProps {
  onOpenCheckout: (plan: PlanType) => void;
  onOpenAnalyzer: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenCheckout,
  onOpenAnalyzer,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("anual");

  return (
    <section
      id="planos"
      className="py-20 bg-slate-900 text-slate-100 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Investimento Inteligente</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Invista na sua Nomeação, Não em Frustração
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Menos que o valor de uma pizza por mês para ter um mentor particular
            de IA e um cronograma estatístico calibrado com a sua banca.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {/* 1. Mensal */}
          <div className="bg-slate-800/80 border border-slate-700 hover:border-slate-600 rounded-3xl p-7 flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Plano Mensal</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                  Flexível
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-6">
                Para quem estuda na reta final ou prefere pagar mês a mês.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">R$ 59,90</span>
                  <span className="text-slate-400 text-xs">/ mês</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cobrança mensal recorrente • Cancele quando quiser
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Análise Ilimitada de Editais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cronograma Diário até a Prova</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tutor IA 24/7 com Mnemônicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulados Inéditos por Banca</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Corretor de Redação IA</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => onOpenCheckout("mensal")}
                className="w-full py-3.5 rounded-xl border border-emerald-500/50 hover:bg-emerald-600/10 text-emerald-300 font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Assinar Mensal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Anual (Destaque Mais Escolhido) */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500 rounded-3xl p-7 flex flex-col justify-between shadow-2xl shadow-emerald-500/15 ring-2 ring-emerald-500/30 transform md:-translate-y-2">
            {/* Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md whitespace-nowrap">
              ⭐ Mais Escolhido • 33% OFF
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-white">
                    Plano Anual
                  </h3>
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  12 Meses
                </span>
              </div>

              <p className="text-slate-300 text-xs mb-6">
                O caminho completo para garantir sua vaga com acompanhamento anual.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-xs line-through">
                    R$ 59,90
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                    R$ 39,90
                  </span>
                  <span className="text-slate-300 text-xs font-semibold">
                    / mês
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300 mt-1 font-medium">
                  R$ 478,80 à vista ou em 12x no cartão de crédito
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>12 Meses de Acesso Completo Ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dissecador 80/20 para Qualquer Concurso</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tutor IA 24/7 (Socrático, Feynman e Leis)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simulados Inéditos & Pegadinhas de Banca</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Repetição Espaçada Ativa Automatizada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Correções de Redação Ilimitadas</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => onOpenCheckout("anual")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Garantir Plano Anual</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantia de 7 Dias • Risco Zero</span>
              </div>
            </div>
          </div>

          {/* 3. Vitalício */}
          <div className="bg-slate-800/90 border border-amber-500/40 hover:border-amber-400/70 rounded-3xl p-7 flex flex-col justify-between transition-all relative">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Infinity className="w-3 h-3" />
              <span>Acesso Até Passar</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-bold text-white">Vitalício</h3>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Sem Renovação
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-6">
                Pague uma única vez e tenha acesso perpétuo até tomar posse.
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400">
                    R$ 697
                  </span>
                  <span className="text-slate-400 text-xs">/ pagamento único</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ou parcele em até 12x no cartão • Todas as atualizações futuras
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Acesso Perpétuo sem Mensalidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Todos os Novos Recursos e IAs Futuras</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Suporte Prioritário VIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Editais Ilimitados para Todos os Concursos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Garantia Incondicional de 7 Dias</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => onOpenCheckout("vitalicio")}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
              >
                <span>Garantir Acesso Vitalício</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Free Plan banner below for trial */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400">
            Deseja testar primeiro?{" "}
            <button
              onClick={onOpenAnalyzer}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer ml-1"
            >
              Experimente a dissecação demonstrativa gratuita de 1 edital
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

