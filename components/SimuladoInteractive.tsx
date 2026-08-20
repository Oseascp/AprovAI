"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy,
  AlertCircle,
  Award,
  Zap,
} from "lucide-react";
import { ExamQuestion } from "@/lib/types";

interface SimuladoInteractiveProps {
  initialDiscipline?: string;
  initialTopic?: string;
  onOpenTutor: (topic: string, discipline: string) => void;
  onOpenCheckout: () => void;
}

const DEFAULT_QUESTIONS: ExamQuestion[] = [
  {
    id: "q_tj_1",
    banca: "Vunesp",
    discipline: "Direito Constitucional",
    topic: "Direitos e Deveres Individuais e Coletivos (Art. 5º da CF/88)",
    statement:
      "Nos termos da Constituição Federal de 1988, a respeito da inviolabilidade do domicílio e da liberdade de reunião, assinale a alternativa correta:",
    options: [
      {
        id: "A",
        text: "A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante a noite, por determinação judicial.",
      },
      {
        id: "B",
        text: "Todos podem reunir-se pacificamente, sem armas, em locais abertos ao público, independentemente de autorização, desde que não frustrem outra reunião anteriormente convocada para o mesmo local, sendo exigido prévio aviso à autoridade competente.",
      },
      {
        id: "C",
        text: "A criação de associações e, na forma da lei, a de cooperativas dependem sempre de prévia autorização estatal para iniciar suas atividades.",
      },
      {
        id: "D",
        text: "As entidades associativas, ainda que sem autorização expressa de seus membros, têm legitimidade para representá-los judicial ou extrajudicialmente.",
      },
      {
        id: "E",
        text: "A dissolução compulsória de uma associação pode ser determinada por decisão judicial cautelar, sem necessidade de trânsito em julgado.",
      },
    ],
    correctOptionId: "B",
    explanation:
      "Gabarito: Letra B (Art. 5º, XVI, CF/88). O direito de reunião independe de autorização, mas exige prévio aviso para evitar choque com reuniões anteriores. Erro da A: ordem judicial é apenas 'durante o dia'. Erro da C: a criação independe de autorização (Art. 5º, XVIII). Erro da D: exige autorização expressa (Art. 5º, XXI). Erro da E: dissolução compulsória exige trânsito em julgado (Art. 5º, XIX).",
    bancaTip:
      "A banca Vunesp altera sistematicamente as palavras 'durante o dia' para 'durante a noite' ou 'independe de autorização' para 'depende de autorização'. Fique muito atento aos advérbios e negações!",
  },
  {
    id: "q_tj_2",
    banca: "Vunesp",
    discipline: "Direito Administrativo",
    topic: "Estatuto dos Servidores Públicos de SP (Lei 10.261/68)",
    statement:
      "De acordo com a Lei Estadual nº 10.261/68 (Estatuto dos Funcionários Públicos Civis de São Paulo), a pena disciplinar de demissão a bem do serviço público será aplicada ao funcionário que:",
    options: [
      {
        id: "A",
        text: "Praticar falta grave no cumprimento dos deveres funcionais, sem reincidência.",
      },
      {
        id: "B",
        text: "Faltar ao serviço por 15 (quinze) dias consecutivos sem causa justificada.",
      },
      {
        id: "C",
        text: "Praticar ato de insubordinação grave ou aplicar indevidamente dinheiros públicos com dolo comprovado.",
      },
      {
        id: "D",
        text: "Cometer falta de assiduidade caracterizada pela ausência ao serviço por mais de 45 dias interpolados no ano.",
      },
      {
        id: "E",
        text: "Chegar atrasado ao expediente de trabalho por 3 dias sucessivos.",
      },
    ],
    correctOptionId: "C",
    explanation:
      "Gabarito: Letra C. A demissão a bem do serviço público (sanção mais grave do Estatuto) é cabível em casos graves como insubordinação grave, aplicação indevida de verbas públicas ou corrupção passiva. O abandono de cargo (30 dias consecutivos) gera demissão simples, não necessariamente a bem do serviço público.",
    bancaTip:
      "Cuidado com a distinção entre 'Demissão Comum' e 'Demissão a Bem do Serviço Público'. Memorize as hipóteses mais graves!",
  },
];

export const SimuladoInteractive: React.FC<SimuladoInteractiveProps> = ({
  initialDiscipline = "Direito Constitucional",
  initialTopic = "Direitos Fundamentais",
  onOpenTutor,
  onOpenCheckout,
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(DEFAULT_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loadingNew, setLoadingNew] = useState(false);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || isAnswered) return;
    setIsAnswered(true);

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Generate new question with AI
      setLoadingNew(true);
      try {
        const res = await fetch("/api/gemini/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discipline: currentQuestion.discipline,
            topic: currentQuestion.topic,
            banca: currentQuestion.banca,
            count: 2,
          }),
        });
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions((prev) => [...prev, ...data.questions]);
          setCurrentIndex(currentIndex + 1);
          setSelectedOptionId(null);
          setIsAnswered(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNew(false);
      }
    }
  };

  const isCurrentCorrect =
    selectedOptionId === currentQuestion.correctOptionId;

  return (
    <section
      id="simulado-section"
      className="py-16 bg-slate-950 text-slate-100 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Simulador Inédito Calibrado com a Banca</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Treine com Questões Comentadas Pela IA
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Resolva questões com comentários completos e aprenda a desarmar
            cada pegadinha da banca organizadora antes da prova real.
          </p>
        </div>

        {/* Score Board Bar */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              #{currentIndex + 1}
            </div>
            <div>
              <p className="text-xs text-slate-400">Questão em foco</p>
              <p className="text-xs sm:text-sm font-bold text-white">
                {currentQuestion.discipline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <p className="text-slate-400">Aproveitamento</p>
              <p className="font-extrabold text-emerald-400 text-sm">
                {score.total > 0
                  ? `${Math.round((score.correct / score.total) * 100)}%`
                  : "0%"}{" "}
                ({score.correct}/{score.total})
              </p>
            </div>

            <button
              onClick={onOpenCheckout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-transform hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              Banco Ilimitado PRO
            </button>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Banca: {currentQuestion.banca}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {currentQuestion.topic}
            </span>
          </div>

          {/* Statement */}
          <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed mb-6">
            {currentQuestion.statement}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOption = opt.id === currentQuestion.correctOptionId;

              let optionStyle =
                "bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200";

              if (isSelected && !isAnswered) {
                optionStyle =
                  "bg-indigo-950 border-indigo-500 text-white ring-1 ring-indigo-500";
              }

              if (isAnswered) {
                if (isCorrectOption) {
                  optionStyle =
                    "bg-emerald-950/90 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle =
                    "bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500";
                } else {
                  optionStyle = "bg-slate-800/40 border-slate-800 text-slate-500";
                }
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${optionStyle}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected && !isAnswered
                        ? "bg-indigo-600 text-white"
                        : isAnswered && isCorrectOption
                        ? "bg-emerald-600 text-white"
                        : isAnswered && isSelected && !isCorrectOption
                        ? "bg-rose-600 text-white"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div className="text-sm sm:text-base leading-snug flex-1">
                    {opt.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOptionId}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Confirmar Resposta
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  {isCurrentCorrect ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Resposta Correta! Parabéns!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                      <XCircle className="w-5 h-5" />
                      <span>Incorreta. Veja a justificativa abaixo.</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={loadingNew}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {loadingNew ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando com IA...</span>
                    </>
                  ) : (
                    <>
                      <span>Próxima Questão</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={() =>
                onOpenTutor(currentQuestion.topic, currentQuestion.discipline)
              }
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-emerald-950/60 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pedir Explicação Completa ao Tutor IA</span>
            </button>
          </div>

          {/* Explanation Box (Revealed when answered) */}
          {isAnswered && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-800/90 border border-slate-700 animate-in fade-in-50 duration-300">
              <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Gabarito Comentado e Fundamentação:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {currentQuestion.explanation}
              </p>

              {currentQuestion.bancaTip && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Raio-X da Banca {currentQuestion.banca}:</strong>{" "}
                    {currentQuestion.bancaTip}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
