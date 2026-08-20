"use client";

import React from "react";
import { Sparkles, ShieldCheck, Heart, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Aprov<span className="text-emerald-500">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A primeira plataforma de inteligência artificial do Brasil
              especializada em dissecação estatística de editais de concursos
              públicos, cronogramas diários adaptativos e mentoria ativa.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL 256-bit Seguro</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garantia 7 Dias</span>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#analisador-edital" className="hover:text-emerald-400 transition-colors">
                  Dissecador de Editais
                </a>
              </li>
              <li>
                <a href="#simulado-section" className="hover:text-emerald-400 transition-colors">
                  Simulador de Questões
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-emerald-400 transition-colors">
                  Planos e Preços
                </a>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Bancas Suportadas
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">Vunesp (TJ-SP, Polícia Civil)</span>
              </li>
              <li>
                <span className="text-slate-400">Cebraspe (INSS, PF, PRF, TCU)</span>
              </li>
              <li>
                <span className="text-slate-400">FGV (Receita Federal, OAB, Senado)</span>
              </li>
              <li>
                <span className="text-slate-400">FCC (Tribunais Federais, TRT, TRE)</span>
              </li>
              <li>
                <span className="text-slate-400">Cesgranrio (Banco do Brasil, Caixa)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} AprovAI Inteligência Educacional Ltda. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Política de Privacidade</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Suporte ao Aluno</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
