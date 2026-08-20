"use client";

import React from "react";
import { Star, ShieldCheck, Award, CheckCircle2, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Mariana Alencar",
      position: "1º Lugar - Escrevente TJ-SP",
      banca: "Vunesp • Nota 9.4",
      avatarBg: "bg-emerald-600",
      initials: "MA",
      comment:
        "Eu já tinha reprovado duas vezes tentando ler a Lei Seca sem ordem. O AprovAI mapeou exatamente os 40 artigos que a Vunesp mais repetia e montou meus blocos de 50 minutos. Em 3 meses saí de 68% para 94% de acertos!",
      badge: "Aprovada em 1º Lugar",
    },
    {
      name: "Lucas Vinícius Mendes",
      position: "Aprovado - Auditor Fiscal RFB",
      banca: "FGV • Preparação 8 Meses",
      avatarBg: "bg-indigo-600",
      initials: "LM",
      comment:
        "O edital da Receita é gigantesco. Sem a matriz de Pareto do AprovAI eu teria me afogado em matérias secundárias. O Tutor IA tirou dúvidas complexas de Direito Tributário às 23h sem eu precisar pagar coach caro.",
      badge: "Auditor Aprovado",
    },
    {
      name: "Camila Guimarães",
      position: "Aprovada - Técnico do Seguro Social",
      banca: "INSS • Cebraspe",
      avatarBg: "bg-teal-600",
      initials: "CG",
      comment:
        "O método de revisão 24h/7d/30d integrado no cronograma fez eu finalmente parar de esquecer o Direito Previdenciário. Os simulados inéditos com alertas de pegadinhas me salvaram na prova da Cebraspe!",
      badge: "Nomeação Garantida",
    },
    {
      name: "Rodrigo Fagundes",
      position: "Top 10 - Agente Polícia Federal",
      banca: "Cebraspe • Carreira Policial",
      avatarBg: "bg-slate-800",
      initials: "RF",
      comment:
        "Trabalho 8h por dia e só tinha 3h para estudar à noite. O cronograma adaptativo foi fundamental para encaixar teoria e questões sem surtar. Recomendo para todo concurseiro que não tem tempo a perder.",
      badge: "Aprovado PF",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Casos de Sucesso Comprovados
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Quem Já Foi Aprovado com a IA do AprovAI
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Mais de 12.000 estudantes já organizaram seus editais e conquistaram
            a posse dos seus sonhos no serviço público.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Stars and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {test.badge}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 italic relative">
                  &quot;{test.comment}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${test.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}
                >
                  {test.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {test.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-emerald-700">
                    {test.position}
                  </p>
                  <p className="text-[10px] text-slate-600">{test.banca}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
