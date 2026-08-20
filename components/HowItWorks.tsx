"use client";

import React from "react";
import { UploadCloud, Cpu, CalendarCheck, ArrowRight, Sparkles } from "lucide-react";

interface HowItWorksProps {
  onOpenAnalyzer: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenAnalyzer }) => {
  const steps = [
    {
      stepNumber: "01",
      icon: UploadCloud,
      title: "Envie seu Edital",
      description:
        "Cole o texto do edital, selecione o concurso ou suba o arquivo PDF do certame. A IA identifica imediatamente o cargo, banca e disciplinas exigidas.",
      highlight: "Suporte a todas as bancas",
      color: "from-emerald-500 to-teal-500",
    },
    {
      stepNumber: "02",
      icon: Cpu,
      title: "A IA Disseca o Conteúdo",
      description:
        "Cruzamos o conteúdo programático com nosso banco de mais de 100.000 questões anteriores para mapear a incidência real de cada tema (Matriz de Pareto 80/20).",
      highlight: "Priorização estatística",
      color: "from-teal-500 to-cyan-500",
    },
    {
      stepNumber: "03",
      icon: CalendarCheck,
      title: "Estude com Direção Diária",
      description:
        "Receba seu cronograma diário adaptativo, com blocos de estudo focados, alertas de pegadinhas da banca e revisões espaçadas 24h, 7d e 30d automáticas.",
      highlight: "Retenção máxima garantida",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Metodologia Científica & IA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Como o AprovAI Transforma seu Estudo em 3 Passos
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Chega de perder semanas tentando organizar cronogramas manuais em
            planilhas confusas. A IA faz o trabalho pesado para você focar
            apenas no que aprova.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 border border-slate-200/80 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {step.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenAnalyzer}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Experimentar Análise Agora Sem Compromisso</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
