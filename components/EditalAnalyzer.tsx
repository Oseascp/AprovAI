"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Zap,
  Sliders,
  Check,
  Flame,
  FileText,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Download,
  Copy,
  Share2,
} from "lucide-react";
import { EditalAnalysisResult, Discipline } from "@/lib/types";

interface EditalAnalyzerProps {
  onOpenTutorWithTopic: (topic: string, discipline: string) => void;
  onOpenSimuladoWithTopic: (discipline: string, topic: string) => void;
  onOpenCheckout: () => void;
}

const PRESET_CONCURSOS = [
  {
    title: "TJ-SP - Escrevente Técnico Judiciário",
    banca: "Vunesp",
    hoursPerDay: 4,
    weeks: 12,
    tag: "Alta Demanda",
  },
  {
    title: "INSS - Técnico do Seguro Social",
    banca: "Cebraspe",
    hoursPerDay: 4,
    weeks: 16,
    tag: "Previsto 2025/2026",
  },
  {
    title: "Receita Federal - Auditor Fiscal",
    banca: "FGV",
    hoursPerDay: 6,
    weeks: 24,
    tag: "Elite Fiscal",
  },
  {
    title: "Polícia Federal - Agente de Polícia",
    banca: "Cebraspe",
    hoursPerDay: 4,
    weeks: 14,
    tag: "Carreira Policial",
  },
  {
    title: "Banco do Brasil - Escriturário",
    banca: "Cesgranrio",
    hoursPerDay: 3,
    weeks: 10,
    tag: "Carreira Bancária",
  },
];

export const EditalAnalyzer: React.FC<EditalAnalyzerProps> = ({
  onOpenTutorWithTopic,
  onOpenSimuladoWithTopic,
  onOpenCheckout,
}) => {
  const [concursoTitle, setConcursoTitle] = useState(
    "TJ-SP - Escrevente Técnico Judiciário"
  );
  const [banca, setBanca] = useState("Vunesp");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [weeksUntilExam, setWeeksUntilExam] = useState(12);
  const [experienceLevel, setExperienceLevel] = useState("Intermediário");
  const [rawEditalText, setRawEditalText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<EditalAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "disciplinas" | "cronograma" | "fases" | "estrategia"
  >("disciplinas");

  // Pomodoro state
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroTopic, setPomodoroTopic] = useState<string | null>(null);

  // Completed study days checklist state
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({
    "Segunda-feira": true,
  });

  const runAnalysis = async (presetData?: {
    title: string;
    banca: string;
    hours: number;
    weeks: number;
  }) => {
    setLoading(true);
    setLoadingStep(1);

    const titleToUse = presetData ? presetData.title : concursoTitle;
    const bancaToUse = presetData ? presetData.banca : banca;
    const hoursToUse = presetData ? presetData.hours : hoursPerDay;
    const weeksToUse = presetData ? presetData.weeks : weeksUntilExam;

    const timer1 = setTimeout(() => setLoadingStep(2), 700);
    const timer2 = setTimeout(() => setLoadingStep(3), 1500);
    const timer3 = setTimeout(() => setLoadingStep(4), 2200);

    try {
      const response = await fetch("/api/gemini/analyze-edital", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concursoTitle: titleToUse,
          banca: bancaToUse,
          hoursPerDay: hoursToUse,
          weeksUntilExam: weeksToUse,
          experienceLevel,
          rawContent: rawEditalText,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_CONCURSOS)[0]) => {
    setConcursoTitle(preset.title);
    setBanca(preset.banca);
    setHoursPerDay(preset.hoursPerDay);
    setWeeksUntilExam(preset.weeks);
    setShowCustomInput(false);
    runAnalysis({
      title: preset.title,
      banca: preset.banca,
      hours: preset.hoursPerDay,
      weeks: preset.weeks,
    });
  };

  const toggleDayCheck = (day: string) => {
    setCompletedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const startPomodoroForTopic = (topic: string) => {
    setPomodoroTopic(topic);
    setPomodoroSeconds(25 * 60);
    setPomodoroActive(true);
  };

  const [copiedNotion, setCopiedNotion] = useState(false);

  const handlePrintSchedule = () => {
    window.print();
  };

  const handleCopyNotion = () => {
    if (!result) return;
    let markdown = `# 📋 Plano de Estudos: ${result.concurso}\n`;
    markdown += `**Banca:** ${result.banca} | **Carga Total:** ${result.totalStudyHours}h\n\n`;
    markdown += `## 🎯 Matriz de Disciplinas (Pareto 80/20)\n`;
    result.disciplines?.forEach((d) => {
      markdown += `- **${d.name}** (${d.weight}% da prova, ${d.hoursRecommended}h recomendadas)\n`;
      d.keyTopics?.forEach((t) => {
        markdown += `  - [ ] ${t}\n`;
      });
    });
    markdown += `\n## 📅 Cronograma Semanal\n`;
    result.sampleWeekSchedule?.forEach((s) => {
      markdown += `### ${s.day}\n`;
      markdown += `- **${s.subject1}**: ${s.topic1}\n`;
      markdown += `- **${s.subject2}**: ${s.topic2}\n`;
      if (s.reviewType) {
        markdown += `- 🔄 *Revisão Espaçada:* ${s.reviewType}\n`;
      }
    });

    navigator.clipboard.writeText(markdown);
    setCopiedNotion(true);
    setTimeout(() => setCopiedNotion(false), 2500);
  };

  const handleExportICal = () => {
    if (!result || !result.sampleWeekSchedule) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AprovAI//Plano de Estudos IA//PT\n";
    const dayMap: Record<string, number> = {
      "Segunda-feira": 1,
      "Terça-feira": 2,
      "Quarta-feira": 3,
      "Quinta-feira": 4,
      "Sexta-feira": 5,
      "Sábado": 6,
      "Domingo": 0,
    };

    const now = new Date();
    result.sampleWeekSchedule.forEach((sch, idx) => {
      const dayOffset = (dayMap[sch.day] ?? idx) - now.getDay();
      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + (dayOffset >= 0 ? dayOffset : dayOffset + 7));
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, "0");
      const date = String(eventDate.getDate()).padStart(2, "0");

      const blocksDesc = `${sch.subject1}: ${sch.topic1}\\n${sch.subject2}: ${sch.topic2}\\nRevisão: ${sch.reviewType}`;
      const summary = `[AprovAI] ${result.concurso} - ${sch.day}`;

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:aprovai-${Date.now()}-${idx}@aprovai.com\n`;
      icsContent += `DTSTAMP:${year}${month}${date}T080000Z\n`;
      icsContent += `DTSTART:${year}${month}${date}T090000Z\n`;
      icsContent += `DTEND:${year}${month}${date}T120000Z\n`;
      icsContent += `SUMMARY:${summary}\n`;
      icsContent += `DESCRIPTION:${blocksDesc}\n`;
      icsContent += "STATUS:CONFIRMED\n";
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR\n";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AprovAI_Cronograma_${result.banca}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="analisador-edital"
      className="py-16 bg-slate-900 text-slate-100 relative overflow-hidden"
    >
      {/* Background neon glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Brain className="w-4 h-4" />
            <span>Motor de IA Estatística de Editais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experimente a Dissecação Inteligente de Edital
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Selecione um concurso abaixo ou insira o seu edital para gerar uma
            matriz de peso por matéria e um cronograma diário sob medida.
          </p>
        </div>

        {/* Preset Selection Buttons */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 text-center sm:text-left">
            Escolha rápida de concurso popular:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRESET_CONCURSOS.map((preset, idx) => {
              const isSelected = concursoTitle === preset.title;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                      : "bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <span className="inline-block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      {preset.tag}
                    </span>
                    <h4 className="font-bold text-sm text-white leading-snug">
                      {preset.title}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                    <span className="font-medium">Banca: {preset.banca}</span>
                    <span className="text-emerald-400 font-semibold">
                      {preset.hoursPerDay}h/dia
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Controls Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 mb-8 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Parâmetros de Ajuste da IA</span>
            </h3>
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 underline underline-offset-2"
            >
              {showCustomInput
                ? "Ocultar texto do edital"
                : "+ Colar texto ou detalhes de outro concurso"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Concurso Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cargo / Concurso
              </label>
              <input
                type="text"
                value={concursoTitle}
                onChange={(e) => setConcursoTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Ex: Auditor TCU, PF Agente..."
              />
            </div>

            {/* Banca */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Banca Organizadora
              </label>
              <select
                value={banca}
                onChange={(e) => setBanca(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Vunesp">Vunesp</option>
                <option value="Cebraspe">Cebraspe (Cespe)</option>
                <option value="FGV">FGV (Fundação Getulio Vargas)</option>
                <option value="FCC">FCC (Fundação Carlos Chagas)</option>
                <option value="Cesgranrio">Cesgranrio</option>
                <option value="Instituto AOCP">Instituto AOCP</option>
                <option value="IBFC">IBFC</option>
                <option value="Outra / Geral">Outra / Padrão Geral</option>
              </select>
            </div>

            {/* Hours per Day */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Horas por Dia
                </label>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {hoursPerDay}h / dia
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                <span>1h</span>
                <span>4h (ideal)</span>
                <span>10h</span>
              </div>
            </div>

            {/* Weeks until Exam */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Prazo até a Prova
                </label>
                <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {weeksUntilExam} semanas
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={36}
                step={2}
                value={weeksUntilExam}
                onChange={(e) => setWeeksUntilExam(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                <span>1 mês</span>
                <span>3 meses</span>
                <span>9 meses</span>
              </div>
            </div>
          </div>

          {/* Collapsible raw text input */}
          {showCustomInput && (
            <div className="mb-4 animate-in fade-in-50 duration-200">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cole trecho das disciplinas do edital ou observações (opcional):
              </label>
              <textarea
                value={rawEditalText}
                onChange={(e) => setRawEditalText(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                placeholder="Ex: Conhecimentos Específicos: Direito Constitucional Art. 5º ao 17... Língua Portuguesa: Crase, Concordância..."
              />
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => runAnalysis()}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Dissecando Edital com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Plano de Estudos com IA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State Animation */}
        {loading && (
          <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-8 my-8 text-center max-w-2xl mx-auto shadow-2xl animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              Dissecando o Edital: {concursoTitle}
            </h4>
            <div className="space-y-2 max-w-md mx-auto text-xs text-left mt-6">
              <div
                className={`p-2.5 rounded-lg flex items-center gap-2 ${
                  loadingStep >= 1
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>1. Extraindo matriz programática e disciplinas...</span>
              </div>
              <div
                className={`p-2.5 rounded-lg flex items-center gap-2 ${
                  loadingStep >= 2
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2. Calculando pesos e incidência histórica na banca {banca}...</span>
              </div>
              <div
                className={`p-2.5 rounded-lg flex items-center gap-2 ${
                  loadingStep >= 3
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>3. Distribuindo {hoursPerDay}h diárias em ciclos de Pareto 80/20...</span>
              </div>
              <div
                className={`p-2.5 rounded-lg flex items-center gap-2 ${
                  loadingStep >= 4
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>4. Gerando alertas de pegadinhas e cronograma semanal...</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {!loading && result && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl">
            {/* Top Summary Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Plano Ativo
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Banca: {result.banca}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    Confiança da IA: {result.confidenceScore}%
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {result.concurso}
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                  {result.summary}
                </p>
              </div>

              {/* Total hours and upgrade teaser */}
              <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700 p-4 rounded-2xl self-stretch lg:self-auto justify-between sm:justify-start">
                <div>
                  <p className="text-xs text-slate-400">Total Estimado</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {result.totalStudyHours}h
                  </p>
                  <p className="text-[11px] text-slate-500">
                    distribuídas no cronograma
                  </p>
                </div>
                <button
                  onClick={onOpenCheckout}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Sincronizar PRO</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs & Export Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 mt-6 pb-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("disciplinas")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "disciplinas"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Disciplinas & Pesos</span>
                </button>
                <button
                  onClick={() => setActiveTab("cronograma")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "cronograma"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Cronograma Diário</span>
                </button>
                <button
                  onClick={() => setActiveTab("fases")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "fases"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>3 Fases</span>
                </button>
                <button
                  onClick={() => setActiveTab("estrategia")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "estrategia"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Raio-X da Banca</span>
                </button>
              </div>

              {/* Quick Actions (Print, iCal, Notion) */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <button
                  onClick={handlePrintSchedule}
                  title="Imprimir ou Salvar como PDF"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Imprimir / PDF</span>
                </button>

                <button
                  onClick={handleExportICal}
                  title="Exportar para Google Calendar / Apple / Outlook (.ics)"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Calendário (.ics)</span>
                </button>

                <button
                  onClick={handleCopyNotion}
                  title="Copiar texto formatado em Markdown para Notion ou WhatsApp"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedNotion ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Copiar Notion</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tab 1: Disciplines & Weights */}
            {activeTab === "disciplinas" && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.disciplines?.map((disc, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-slate-600 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-extrabold text-base text-white">
                            {disc.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              disc.importance === "Crítica"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : disc.importance === "Alta"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {disc.importance}
                          </span>
                        </div>

                        {/* Weight progress bar */}
                        <div className="space-y-1 mb-4">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Peso estimado na prova</span>
                            <span className="text-emerald-400 font-bold">
                              {disc.weight}% ({disc.hoursRecommended}h de estudo)
                            </span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${disc.weight * 2.5}%` }}
                            />
                          </div>
                        </div>

                        {/* Key topics list */}
                        <div className="mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Tópicos de Maior Incidência (Pareto):
                          </p>
                          <ul className="space-y-1">
                            {disc.keyTopics?.map((topic, tIdx) => (
                              <li
                                key={tIdx}
                                className="text-xs text-slate-300 flex items-start gap-1.5"
                              >
                                <span className="text-emerald-400 mt-0.5">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Banca trap alert */}
                        {disc.bancaTrapAlert && (
                          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2 mb-4">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Pegadinha {result.banca}:</strong>{" "}
                              {disc.bancaTrapAlert}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quick AI interactions for this discipline */}
                      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            onOpenTutorWithTopic(disc.keyTopics[0] || disc.name, disc.name)
                          }
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-emerald-950/60 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Perguntar ao Tutor IA</span>
                        </button>
                        <button
                          onClick={() =>
                            onOpenSimuladoWithTopic(disc.name, disc.keyTopics[0] || "")
                          }
                          className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-indigo-950/60 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Simular Questões</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Weekly Schedule */}
            {activeTab === "cronograma" && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl text-xs text-slate-300 mb-2">
                  <span>
                    💡 <strong>Dica de Execução:</strong> Marque os dias
                    conforme cumpre suas metas para alimentar a curva de
                    retenção da IA.
                  </span>
                  <span className="text-emerald-400 font-bold hidden sm:inline">
                    Ciclo 24h/7d/30d
                  </span>
                </div>

                <div className="space-y-3">
                  {result.sampleWeekSchedule?.map((dayPlan, idx) => {
                    const isDone = completedDays[dayPlan.day] || false;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDone
                            ? "bg-slate-800/40 border-emerald-900/60 opacity-90"
                            : "bg-slate-800 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleDayCheck(dayPlan.day)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                isDone
                                  ? "bg-emerald-600 text-white"
                                  : "border-2 border-slate-600 hover:border-emerald-500"
                              }`}
                            >
                              {isDone && <Check className="w-4 h-4" />}
                            </button>
                            <span className="font-bold text-sm text-white">
                              {dayPlan.day}
                            </span>
                          </div>

                          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium">
                            {dayPlan.reviewType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-700/60">
                          {/* Subject 1 */}
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-400">
                                Bloco 1 ({Math.round(hoursPerDay * 0.6)}h)
                              </span>
                              <button
                                onClick={() =>
                                  startPomodoroForTopic(
                                    `${dayPlan.subject1} - ${dayPlan.topic1}`
                                  )
                                }
                                className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                              >
                                <Clock className="w-3 h-3 text-emerald-400" /> Pomodoro
                              </button>
                            </div>
                            <p className="font-semibold text-xs text-white mt-1">
                              {dayPlan.subject1}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {dayPlan.topic1}
                            </p>
                          </div>

                          {/* Subject 2 */}
                          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-teal-400">
                                Bloco 2 ({Math.round(hoursPerDay * 0.4)}h)
                              </span>
                              <button
                                onClick={() =>
                                  startPomodoroForTopic(
                                    `${dayPlan.subject2} - ${dayPlan.topic2}`
                                  )
                                }
                                className="text-[10px] text-slate-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                              >
                                <Clock className="w-3 h-3 text-teal-400" /> Pomodoro
                              </button>
                            </div>
                            <p className="font-semibold text-xs text-white mt-1">
                              {dayPlan.subject2}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {dayPlan.topic2}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Study Phases */}
            {activeTab === "fases" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.studyPhases?.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-3">
                        0{idx + 1}
                      </div>
                      <h4 className="font-bold text-base text-white mb-2">
                        {phase.phaseName}
                      </h4>
                      <p className="text-xs text-slate-300 mb-4">
                        <strong className="text-emerald-400">Objetivo:</strong>{" "}
                        {phase.goal}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
                      <span className="text-slate-400 font-bold block mb-1">
                        Rotina Diária Recomendada:
                      </span>
                      {phase.dailyFocus}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Strategy Tips */}
            {activeTab === "estrategia" && (
              <div className="mt-6 space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-100 text-sm mb-4">
                  <h4 className="font-bold text-base text-emerald-300 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Diretrizes de Aprovação
                    para a Banca {result.banca}
                  </h4>
                  <p className="text-xs text-emerald-200">
                    Compiladas através da análise de mais de 10.000 questões
                    reais da banca organizadora.
                  </p>
                </div>

                {result.topStrategyTips?.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-200">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Pomodoro Widget if activated */}
        {pomodoroTopic && (
          <div className="fixed bottom-6 right-6 z-40 bg-slate-900/95 border border-emerald-500/60 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Pomodoro de Foco
              </span>
              <button
                onClick={() => setPomodoroTopic(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 truncate mb-2">{pomodoroTopic}</p>
            <div className="text-3xl font-mono font-black text-center text-emerald-400 my-2">
              {Math.floor(pomodoroSeconds / 60)
                .toString()
                .padStart(2, "0")}
              :{(pomodoroSeconds % 60).toString().padStart(2, "0")}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setPomodoroActive(!pomodoroActive)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
              >
                {pomodoroActive ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>{pomodoroActive ? "Pausar" : "Continuar"}</span>
              </button>
              <button
                onClick={() => {
                  setPomodoroActive(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
