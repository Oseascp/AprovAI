import { NextRequest, NextResponse } from "next/server";
import { generatePixPayload } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { plan, customerName, customerEmail, discountRate = 0 } =
      await req.json();

    const basePrice =
      plan === "vitalicio" ? 697.0 : plan === "anual" ? 478.8 : 59.9;
    const finalAmount = Number((basePrice * (1 - discountRate)).toFixed(2));

    const orderId = `PIX-${Date.now().toString(36).toUpperCase()}`;
    const pixData = generatePixPayload(
      finalAmount,
      orderId,
      customerName || "Estudante Concurseiro"
    );

    return NextResponse.json({
      success: true,
      orderId,
      amount: finalAmount,
      pixCode: pixData.pixCode,
      qrCodeUrl: pixData.qrCodeUrl,
      expiresInMinutes: pixData.expiresInMinutes,
      beneficiary: "AprovAI Serviços Educacionais Ltda",
      cnpj: "48.291.384/0001-92",
      institution: "Banco Central do Brasil / PIX",
    });
  } catch (error: any) {
    console.error("Pix generation error:", error);
    return NextResponse.json(
      { error: "Erro ao gerar cobrança PIX" },
      { status: 500 }
    );
  }
}
