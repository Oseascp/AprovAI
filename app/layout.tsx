import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AprovAI - Seu edital. Seu plano. Sua aprovação.',
  description:
    'A IA que disseca seu edital em segundos, prioriza o que realmente cai e monta seu cronograma de estudos diário personalizado até o dia da prova.',
  openGraph: {
    title: 'AprovAI - Inteligência Artificial para Concursos Públicos',
    description:
      'Dissecação de editais, cronograma adaptativo, Tutor IA 24/7 e simulados calibrados com a banca examinadora.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AprovAI - Seu edital. Seu plano. Sua aprovação.',
    description:
      'Dissecação de editais, cronograma adaptativo, Tutor IA 24/7 e simulados calibrados com a banca examinadora.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
