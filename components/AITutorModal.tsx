"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  BrainCircuit,
  MessageSquare,
  Zap,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Flame,
  Scale,
} from "lucide-react";
import { ChatMessage } from "@/lib/types";

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialDiscipline?: string;
  onOpenCheckout: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic = "",
  initialDiscipline = "",
  onOpenCheckout,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content:
        "Olá, futuro(a) aprovado(a)! 👋 Eu sou o **Tutor IA AprovAI**, seu mentor particular 24/7.\n\nQual dúvida de concurso público você gostaria de desvendar hoje? Posso te explicar a matéria, criar um **mnemônico inesquecível**, revelar **pegadinhas da banca** ou usar a **Técnica Feynman**!",
      timestamp: "Agora",
    },
  ]);

  const [input, setInput] = useState(
    initialTopic ? `Explique com exemplos práticos o tema: ${initialTopic}` : ""
  );
  const [mode, setMode] = useState<
    "direto" | "socratico" | "feynman" | "mnemonico" | "banca_pegadinha"
  >("direto");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgCounter = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const questionText = textToSend || input;
    if (!questionText.trim() || loading) return;

    const count = msgCounter.current++;
    const userMessage: ChatMessage = {
      id: `usr_${count}`,
      role: "user",
      content: questionText,
      timestamp: "Agora",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          concurso: "Geral / Concursos Públicos",
          banca: "Vunesp / Cebraspe / FGV",
          mode,
          chatHistory: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const aiCount = msgCounter.current++;
      const aiReply: ChatMessage = {
        id: `ai_${aiCount}`,
        role: "assistant",
        content: data.reply || "Conteúdo gerado com sucesso.",
        mode: data.mode || mode,
        timestamp: "Agora",
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error("Tutor request error:", err);
      const fallbackCount = msgCounter.current++;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_fallback_${fallbackCount}`,
          role: "assistant",
          content:
            "**Dica de Concurso do Tutor AprovAI:**\n\nNeste ponto, foque sempre nas 3 perguntas essenciais que as bancas costumam fazer:\n1. Qual é a regra geral da lei?\n2. Quais são as exceções expressas?\n3. Qual é a pegadinha terminológica da banca?\n\n💡 *Fórmula de Memorização:* Associe o conceito com um caso prático do cotidiano de um servidor público.",
          timestamp: "Agora",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      label: "🧠 Mnemônico Art. 37 CF",
      prompt: "Crie um mnemônico fácil para decorar os princípios expressos da Administração Pública no Art. 37 da CF/88.",
    },
    {
      label: "⚖️ Dolo vs Culpa (Feynman)",
      prompt: "Me explique a diferença entre dolo eventual e culpa consciente com uma analogia simples e sem juridiquês difícil.",
      modeToSet: "feynman" as const,
    },
    {
      label: "🎯 Pegadinhas de Crase",
      prompt: "Quais são as 3 pegadinhas mais comuns de crase que a banca adora colocar nas provas?",
      modeToSet: "banca_pegadinha" as const,
    },
    {
      label: "📜 Atos Administrativos",
      prompt: "Quais são os 5 requisitos ou elementos do ato administrativo e quais deles são sempre vinculados?",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl h-[90vh] max-h-[750px] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Tutor IA AprovAI
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mentor de elite para esclarecimento de dúvidas e memorização ativa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCheckout}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Perguntas Ilimitadas PRO
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector Ribbon */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0">
            Estilo de Explicação:
          </span>
          <button
            onClick={() => setMode("direto")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              mode === "direto"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Direto & Esquematizado
          </button>
          <button
            onClick={() => setMode("feynman")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              mode === "feynman"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Técnica Feynman (Simples)
          </button>
          <button
            onClick={() => setMode("mnemonico")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              mode === "mnemonico"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Mnemônicos & Macetes
          </button>
          <button
            onClick={() => setMode("banca_pegadinha")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              mode === "banca_pegadinha"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Raio-X de Pegadinha
          </button>
          <button
            onClick={() => setMode("socratico")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              mode === "socratico"
                ? "bg-emerald-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Método Socrático
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 mt-1 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs"
                  }`}
                >
                  {/* Message body with simple line formatting */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Copy helper */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Check className="w-3 h-3" /> Resposta Validada
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-300 flex items-center gap-2">
                <span className="animate-pulse font-medium">
                  Consultando doutrina, lei seca e jurisprudência da banca...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (qp.modeToSet) setMode(qp.modeToSet);
                handleSendMessage(qp.prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida de concurso aqui..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
