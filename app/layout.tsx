import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  metadataBase: new URL('https://aprovai.netlify.app'),
  title: 'AprovAI - Seu edital. Seu plano. Sua aprovação.',
  description:
    'A IA que disseca seu edital em segundos, prioriza o que realmente cai e monta seu cronograma de estudos diário personalizado até o dia da prova.',
  verification: {
    google: 'fZC5phheNNCfgiDYsxLZ8r37v9kQV5dYs36EDwg8Py4',
  },
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
      <head>
        <meta
          name="google-site-verification"
          content="fZC5phheNNCfgiDYsxLZ8r37v9kQV5dYs36EDwg8Py4"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
