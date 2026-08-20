"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  FileEdit,
  Award,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Zap,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface EssayCorrectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

interface EssayCriterion {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface EssayResult {
  totalScore: number;
  maxScore: number;
  bancaStyle: string;
  verdict: string;
  criteria: EssayCriterion[];
  strengths: string[];
  improvements: string[];
  rewrittenParagraphSuggestion?: string;
  bancaTrapAlert?: string;
}

const THEME_PRESETS = [
  {
    title: "O Papel da Inteligência Artificial e a LGPD no Serviço Público",
    banca: "FGV",
    cargo: "Auditor / Analista",
    samplePrompt:
      "Considerando o avanço das ferramentas automatizadas e a proteção dos direitos fundamentais da privacidade, redija um texto dissertativo abordando os limites éticos e jurídicos do uso de IA pelo Estado.",
  },
  {
    title: "A Eficiência Administrativa e o Controle de Gastos Públicos",
    banca: "Vunesp",
    cargo: "Escrevente / Oficial",
    samplePrompt:
      "Discorra sobre a aplicação do princípio da eficiência (Art. 37, CF/88) na gestão dos recursos públicos e os impactos no atendimento ao cidadão.",
  },
  {
    title: "Segurança Pública e Direitos Humanos: Desafios Contemporâneos",
    banca: "Cebraspe",
    cargo: "Polícia Federal / PRF",
    samplePrompt:
      "Redija um texto dissertativo avaliando a integração entre inteligência policial, policiamento comunitário e o estrito respeito às garantias constitucionais.",
  },
];

export const EssayCorrectorModal: React.FC<EssayCorrectorModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
}) => {
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);
  const [essayText, setEssayText] = useState("");
  const [banca, setBanca] = useState("FGV");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EssayResult | null>(null);

  if (!isOpen) return null;

  const wordsCount = essayText.trim()
    ? essayText.trim().split(/\s+/).length
    : 0;
  const linesCount = essayText.split("\n").length;

  const handleAnalyze = async () => {
    if (!essayText.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/gemini/analyze-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedTheme.title,
          banca,
          essayText,
          criteriaType: "Dissertação Argumentativa Concurso Público",
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing essay:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySample = () => {
    setEssayText(
      `A inserção da inteligência artificial na Administração Pública brasileira representa um marco transformador para a concretização dos princípios constitucionais da eficiência e da celeridade processual, insculpidos no artigo 37 da Carta Magna de 1988.\n\nContudo, essa modernização tecnológica deve ocorrer em estrita consonância com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), que impõe balizas intransponíveis à atuação estatal. O tratamento massivo de dados pessoais pelo Poder Público exige a observância dos princípios da finalidade, da necessidade e da não discriminação, sob pena de violação à intimidade e à dignidade da pessoa humana.\n\nAdemais, faz-se imperativo assegurar a auditabilidade e a explicabilidade dos algoritmos decisórios governamentais, garantindo ao cidadão o direito à ampla defesa e ao devido processo legal. A automação não pode substituir o juízo crítico e a responsabilidade humana nas tomadas de decisão que impactam direitos subjetivos.\n\nInfere-se, portanto, que o Estado deve investir na governança digital ética e transparente, promovendo a capacitação contínua dos servidores e a fiscalização rigorosa pela Autoridade Nacional de Proteção de Dados (ANPD), de modo a harmonizar a inovação tecnológica com a salvaguarda inegociável dos direitos fundamentais.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative my-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Corretor Oficial de Redação & Discursiva com IA
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Espelho da Banca
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avaliação criteriosa com base nos critérios de pontuação da sua banca
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {!result ? (
            <div className="space-y-5">
              {/* Theme Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Escolha um Tema Recomendado ou Digite o seu:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {THEME_PRESETS.map((th, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedTheme(th);
                        setBanca(th.banca);
                      }}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedTheme.title === th.title
                          ? "bg-slate-800 border-amber-500 ring-1 ring-amber-500"
                          : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                          {th.banca}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {th.cargo}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-2">
                        {th.title}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                  <span className="font-bold text-amber-400">
                    Proposta da Banca:{" "}
                  </span>
                  {selectedTheme.samplePrompt}
                </div>
              </div>

              {/* Text Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Seu Texto Dissertativo:
                  </label>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>
                      {wordsCount} palavras • ~{Math.max(1, Math.round(wordsCount / 12))} linhas
                    </span>
                    <button
                      type="button"
                      onClick={handleApplySample}
                      className="text-amber-400 hover:text-amber-300 font-semibold underline text-xs"
                    >
                      Preencher Exemplo Pronto
                    </button>
                  </div>
                </div>

                <textarea
                  rows={10}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Cole ou digite aqui a sua redação ou resposta para a questão discursiva..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500">
                  ⚡ Análise em menos de 5 segundos com Inteligência Artificial
                </p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!essayText.trim() || loading}
                  className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Corrigindo com Espelho da Banca...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Corrigir Minha Redação Agora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-in fade-in-50">
              {/* Score Header Card */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{result.verdict}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Resultado da Avaliação: {selectedTheme.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Banca Avaliadora: {result.bancaStyle || banca}
                  </p>
                </div>

                <div className="text-center sm:text-right bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-700 shrink-0">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Nota Final
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-amber-400">
                    {result.totalScore}
                    <span className="text-lg text-slate-500">
                      /{result.maxScore}
                    </span>
                  </p>
                </div>
              </div>

              {/* Criteria Breakdown */}
              <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6">
                <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Espelho Detalhado por Critério de Avaliação</span>
                </h4>

                <div className="space-y-4">
                  {result.criteria?.map((crit, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-200">
                          {crit.name}
                        </span>
                        <span className="text-xs font-extrabold text-amber-400">
                          {crit.score} / {crit.maxScore} pts
                        </span>
                      </div>
                      {/* Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all"
                          style={{
                            width: `${(crit.score / crit.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-400">{crit.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pontos Fortes Identificados:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.strengths?.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/50">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Oportunidades de Melhoria:</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.improvements?.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">!</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rewritten Paragraph Suggestion */}
              {result.rewrittenParagraphSuggestion && (
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
                  <h5 className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Sugestão de Reescrita de Parágrafo (Nota 1000):</span>
                  </h5>
                  <p className="text-slate-300 italic leading-relaxed">
                    &quot;{result.rewrittenParagraphSuggestion}&quot;
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setResult(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submeter Outro Texto</span>
                </button>

                <button
                  onClick={onOpenCheckout}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Correções Ilimitadas no PRO</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
