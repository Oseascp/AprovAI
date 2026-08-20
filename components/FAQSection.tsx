"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como o AprovAI sabe quais matérias e artigos mais caem na minha banca?",
      answer:
        "Nosso motor de IA é treinado e calibrado com mais de 100.000 questões anteriores das principais bancas do país (Cebraspe, FGV, Vunesp, FCC, Cesgranrio, AOCP, etc.). Ao analisar o edital, a IA cruza os tópicos exigidos com a frequência histórica e a taxa de repetição estatística daquela banca organizadora específica.",
    },
    {
      question: "Serve para qualquer concurso público do Brasil?",
      answer:
        "Sim! Você pode analisar editais federais, estaduais ou municipais. O AprovAI funciona para carreiras jurídicas, policiais (PF, PRF, PC), fiscais (Receita, SEFAZ), bancárias (BB, Caixa), administrativas (INSS, Tribunais TJ/TRT/TRF) e muito mais.",
    },
    {
      question: "O que acontece se eu não tiver muito tempo para estudar durante a semana?",
      answer:
        "O cronograma do AprovAI é 100% customizável à sua realidade. Você informa quantas horas reais tem por dia (por exemplo, 2h ou 3h) e a IA aplica a regra de Pareto para encaixar os 20% do edital que geram 80% da sua nota, priorizando o essencial.",
    },
    {
      question: "Como funciona o Tutor IA 24/7?",
      answer:
        "O Tutor IA funciona como um professor particular de elite disponível a qualquer hora no seu celular ou computador. Você pode colar qualquer dúvida ou artigo de lei e pedir explicação em 4 formatos diferentes: Direto & Esquematizado, Técnica Feynman (linguagem simples com analogias), Mnemônicos/Macetes para decorar ou Raio-X de Pegadinhas da banca.",
    },
    {
      question: "Como funciona a Garantia de 7 Dias?",
      answer:
        "É risco zero para você. Após assinar o AprovAI PRO, você tem 7 dias corridos para explorar a plataforma, gerar seus cronogramas e usar o Tutor IA à vontade. Se por qualquer motivo não ficar 100% satisfeito, basta enviar um e-mail com 1 clique e devolvemos todo o seu dinheiro.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Tudo o que Você Precisa Saber
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Ficou com alguma dúvida? Confira as respostas para as perguntas mais
            comuns sobre o AprovAI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in-50 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
