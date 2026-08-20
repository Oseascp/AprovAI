import Stripe from "stripe";
import { generatePix, DEFAULT_PIX_KEY } from "./pix";

export type PlanType = "mensal" | "anual" | "vitalicio";

export const STRIPE_PAYMENT_LINKS: Record<PlanType, string> = {
  mensal:
    process.env.NEXT_PUBLIC_STRIPE_LINK_MENSAL ||
    "https://buy.stripe.com/00w5kC2LpaiA7Bkcbk5gc01",
  anual:
    process.env.NEXT_PUBLIC_STRIPE_LINK_ANUAL ||
    "https://buy.stripe.com/aFacN43PtfCU7Bk2AK5gc02",
  vitalicio:
    process.env.NEXT_PUBLIC_STRIPE_LINK_VITALICIO ||
    "https://buy.stripe.com/4gM14m2LpduMg7Qb7g5gc03",
};

// Default fallback link (Anual)
export const STRIPE_PAYMENT_LINK = STRIPE_PAYMENT_LINKS.anual;

export { DEFAULT_PIX_KEY };

let stripeClient: Stripe | null = null;

/**
 * Returns a lazily initialized Stripe client.
 * Never throws at module load time to prevent dev server crash if key is missing.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
}

/**
 * Generates an authentic EMV standard Pix QR Code payload and transaction ID
 */
export function generatePixPayload(
  amountBrl: number,
  orderId: string,
  buyerName?: string
) {
  const pix = generatePix({
    amount: amountBrl,
    txId: orderId.replace(/[^A-Za-z0-9]/g, "").slice(0, 20),
    description: `AprovAI PRO - ${buyerName || "Estudante"}`,
  });

  return {
    pixCode: pix.pixCode,
    qrCodeUrl: pix.qrCodeUrl,
    expiresInMinutes: 15,
    amount: amountBrl,
    orderId,
  };
}


