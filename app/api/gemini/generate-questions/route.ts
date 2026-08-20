import { NextRequest, NextResponse } from "next/server";
import { generateContentSafe } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let discipline = "Direito Constitucional";
  let topic = "Direitos e Garantias Fundamentais";
  let banca = "Vunesp";
  let concurso = "TJ-SP";
  let count = 3;

  try {
    const body = await req.json();
    discipline = body.discipline || discipline;
    topic = body.topic || topic;
    banca = body.banca || banca;
    concurso = body.concurso || concurso;
    count = body.count || count;

    const prompt = `
Você é o elaborador sênior de provas de concursos públicos do AprovAI.
Gere ${count} questões INÉDITAS no estilo exato da banca ${banca} para o concurso ${concurso}.
Disciplina: ${discipline}
Tópico: ${topic}

Se a banca for Cebraspe, as questões podem ser de formato Certo/Errado ou Múltipla Escolha (A, B, C, D, E).
Para Vunesp/FCC/FGV, use formato de múltipla escolha com 5 alternativas (A, B, C, D, E).

Retorne ESTRITAMENTE um objeto JSON válido (sem texto adicional fora do JSON) no seguinte formato:
{
  "questions": [
    {
      "id": "q1",
      "banca": "${banca}",
      "discipline": "${discipline}",
      "topic": "${topic}",
      "statement": "Enunciado completo e contextualizado da questão...",
      "options": [
        { "id": "A", "text": "Texto da alternativa A" },
        { "id": "B", "text": "Texto da alternativa B" },
        { "id": "C", "text": "Texto da alternativa C" },
        { "id": "D", "text": "Texto da alternativa D" },
        { "id": "E", "text": "Texto da alternativa E" }
      ],
      "correctOptionId": "B",
      "explanation": "Comentário detalhado explicando por que a alternativa correta está certa (com citação de artigo de lei, jurisprudência ou regra gramatical) e apontando os erros de cada distrator.",
      "bancaTip": "Macete para não cair na pegadinha da banca nesta matéria."
    }
  ]
}
`;

    const generatedText = await generateContentSafe({
      prompt,
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    if (generatedText) {
      const cleaned = generatedText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      const data = JSON.parse(cleaned);
      if (data && data.questions && data.questions.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (error) {
    console.warn("Generate questions AI fallback triggered:", error);
  }

  return NextResponse.json({
    questions: [
      {
        id: `q_fallback_${Date.now()}_1`,
        banca: banca,
        discipline: discipline,
        topic: topic,
        statement: `(AprovAI Inéditas / Estilo ${banca}) A respeito da matéria de ${discipline} (${topic}), assinale a alternativa que guarda estrita conformidade com o ordenamento jurídico e a jurisprudência sumulada:`,
        options: [
          {
            id: "A",
            text: "A criação de associações e a de cooperativas dependem de autorização prévia do Poder Executivo em qualquer hipótese.",
          },
          {
            id: "B",
            text: "A manifestação do pensamento é livre, sendo vedado expressamente o anonimato na ordem constitucional brasileira.",
          },
          {
            id: "C",
            text: "A dissolução compulsória de associações pode ser determinada por decisão judicial cautelar sem trânsito em julgado.",
          },
          {
            id: "D",
            text: "É permitida a interferência direta estatal no funcionamento interno e deliberações de cooperativas constituídas.",
          },
          {
            id: "E",
            text: "A casa é asilo inviolável, não se admitindo ingresso nem mesmo em situação de flagrante delito sem consentimento.",
          },
        ],
        correctOptionId: "B",
        explanation: `Gabarito correto: Letra B (Art. 5º, inciso IV, CF/88: 'é livre a manifestação do pensamento, sendo vedado o anonimato'). Erro da A: independem de autorização. Erro da C: a dissolução compulsória exige trânsito em julgado. Erro da D: é vedada a interferência estatal. Erro da E: flagrante delito e desastre autorizam ingresso a qualquer hora.`,
        bancaTip: `A banca ${banca} frequentemente testa a diferença entre 'suspensão de atividades' (basta decisão judicial simples) e 'dissolução compulsória' (exige trânsito em julgado).`,
      },
    ],
  });
}
