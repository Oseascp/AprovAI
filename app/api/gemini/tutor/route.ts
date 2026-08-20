import { NextRequest, NextResponse } from "next/server";
import { generateContentSafe } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let question = "";
  let concurso = "TJ-SP / Geral";
  let banca = "Geral";
  let mode = "direto"; // 'direto', 'socratico', 'feynman', 'mnemonico', 'banca_pegadinha'
  let chatHistory: Array<{ role: string; content: string }> = [];

  try {
    const body = await req.json();
    question = body.question || "";
    concurso = body.concurso || concurso;
    banca = body.banca || banca;
    mode = body.mode || mode;
    chatHistory = body.chatHistory || [];

    let systemPrompt = `
Você é o "Tutor IA AprovAI", o mentor particular de elite em concursos públicos no Brasil.
Seu objetivo é garantir a aprovação do candidato no concurso "${concurso}" (Banca: ${banca}).

Diretrizes gerais:
- Responda sempre em Português do Brasil com clareza impecável, estrutura pedagógica moderna e objetividade.
- Destaque termos fundamentais em **negrito**.
- Conecte o conceito com o padrão de cobrança da banca ${banca}.
- Ao final, sempre dê um "Gatilho de Memorização" ou "Dica de Ouro da Banca".
`;

    if (mode === "socratico") {
      systemPrompt += `
Modo Socrático ativado: Não entregue a resposta pronta de imediato. Faça perguntas guiadas e reflexões curtas para conduzir o aluno a deduzir a regra jurídica ou o raciocínio por conta própria, validando cada etapa.`;
    } else if (mode === "feynman") {
      systemPrompt += `
Modo Técnica Feynman ativado: Explique o conceito como se estivesse ensinando para alguém de 12 anos ou para quem nunca estudou Direito/Concursos. Use analogias do dia a dia vívidas, sem juridiquês pesado, e só depois conecte com a lei.`;
    } else if (mode === "mnemonico") {
      systemPrompt += `
Modo Mnemônico & Macetes ativado: Crie um mnemônico criativo, sonoro e inesquecível para memorizar os incisos, princípios ou regras solicitadas (ex: LIMPE, SOCIDIVAPLU, etc.). Explique o significado de cada letra/sílaba.`;
    } else if (mode === "banca_pegadinha") {
      systemPrompt += `
Modo Raio-X de Pegadinha da Banca ativado: Mostre exatamente como a banca ${banca} costuma tentar induzir o candidato ao erro neste tema (ex: trocar 'pode' por 'deve', 'anual' por 'bienal', competências exclusivas vs privativas).`;
    }

    const conversationContext = `${systemPrompt}\n\nHistórico recente:\n${chatHistory
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "user" ? "Aluno" : "Tutor"}: ${m.content}`
      )
      .join("\n")}\n\nNova pergunta do aluno:\n"${question}"`;

    const generatedText = await generateContentSafe({
      prompt: conversationContext,
      temperature: 0.4,
    });

    if (generatedText) {
      return NextResponse.json({ reply: generatedText, mode });
    }
  } catch (error) {
    console.warn("Tutor IA fallback triggered:", error);
  }

  return NextResponse.json({
    reply: `**Diretriz Estratégica do Tutor AprovAI (${banca}):**\n\nNeste tópico para o cargo de **${concurso}**, as bancas costumam focar na literalidade da legislação e suas exceções expressas.\n\n💡 **Dica de Ouro:**\nEm atos administrativos, a competência, a finalidade e a forma são elementos sempre vinculados por lei. Já o motivo e o objeto admitem discricionariedade quanto à conveniência e oportunidade do administrador.\n\n🧠 **Mnemônico:** \`COM-FI-FO-MO-OB\` (Competência, Finalidade, Forma, Motivo, Objeto).`,
    mode: mode || "direto",
  });
}
