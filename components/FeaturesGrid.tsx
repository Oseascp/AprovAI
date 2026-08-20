"use client";

import React from "react";
import {
  BrainCircuit,
  PieChart,
  Repeat,
  Sparkles,
  Award,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  CheckCircle,
  Zap,
} from "lucide-react";

interface FeaturesGridProps {
  onOpenTutor: () => void;
  onOpenSimulado: () => void;
  onOpenCheckout: () => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  onOpenTutor,
  onOpenSimulado,
  onOpenCheckout,
}) => {
  const features = [
    {
      icon: BrainCircuit,
      title: "Análise Profunda do Edital",
      description:
        "A IA lê até 300 páginas de edital em segundos, extrai todas as disciplinas, pesos de prova, critérios de desempate e normas específicas.",
      tag: "Processamento Instantâneo",
      action: "Ver na prática",
    },
    {
      icon: PieChart,
      title: "Priorização Inteligente (Pareto 80/20)",
      description:
        "Mais de 80% das questões vêm de 20% do edital. O AprovAI destaca com precisão cirúrgica os tópicos com maior índice de recorrência na banca.",
      tag: "Economia de 200+ horas",
      action: "Entenda a matriz",
    },
    {
      icon: Repeat,
      title: "Revisão Ativa & Curva de Ebbinghaus",
      description:
        "Sistema automatizado de repetição espaçada (24h, 7 dias, 30 dias) para combater o esquecimento e blindar sua memória até o dia da prova.",
      tag: "Memorização Científica",
      action: "Como funciona",
    },
    {
      icon: Sparkles,
      title: "IA Tutor 24/7 Personalizado",
      description:
        "Tire qualquer dúvida na hora com o Tutor IA. Peça explicações no formato Feynman, mnemônicos inesquecíveis ou simulação socrática.",
      tag: "Disponível 24 Horas",
      action: "Testar Tutor Agora",
      onClick: onOpenTutor,
    },
    {
      icon: Award,
      title: "Simulados Inéditos Calibrados",
      description:
        "Questões criadas no estilo exato da sua banca (Vunesp, Cebraspe, FGV, FCC) com gabarito comentado item por item e raio-x de pegadinhas.",
      tag: "Treino em Nível Real",
      action: "Fazer Simulado",
      onClick: onOpenSimulado,
    },
    {
      icon: SlidersHorizontal,
      title: "Cronograma Flexível & Adaptativo",
      description:
        "Atrasou uma matéria ou teve imprevisto no trabalho? A IA recalcula automaticamente sua carga horária diária sem quebrar seu ritmo.",
      tag: "Zero Frustração",
      action: "Conhecer o PRO",
      onClick: onOpenCheckout,
    },
  ];

  return (
    <section id="recursos" className="py-20 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Recursos Exclusivos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            A Vantagem Competitiva que Você Precisa
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Enquanto a maioria estuda de forma desordenada lendo PDFs do início
            ao fim, você foca exatamente nos tópicos com maior probabilidade
            estatística de cair na sua prova.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={feat.onClick}
                className={`bg-white border border-slate-200/80 rounded-3xl p-7 hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between ${
                  feat.onClick ? "cursor-pointer group hover:-translate-y-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>{feat.action}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
