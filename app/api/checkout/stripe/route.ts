import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_PAYMENT_LINKS, PlanType } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const {
      plan = "anual",
      customerEmail,
      customerName,
      customerCpf,
      paymentMethodType,
      discountRate = 0,
    } = await req.json();

    const currentPlan: PlanType =
      plan === "vitalicio" || plan === "mensal" ? plan : "anual";

    const basePrice =
      currentPlan === "vitalicio"
        ? 697.0
        : currentPlan === "anual"
        ? 478.8
        : 59.9;
    const finalAmount = Math.round(basePrice * (1 - discountRate) * 100); // in cents (BRL)

    const stripe = getStripe();

    // If Stripe Secret Key is configured, create real Stripe Checkout Session
    if (stripe) {
      const origin =
        req.headers.get("origin") ||
        process.env.APP_URL ||
        "http://localhost:3000";

      const planTitle =
        currentPlan === "vitalicio"
          ? "Vitalício (Acesso Perpétuo)"
          : currentPlan === "anual"
          ? "Anual (33% OFF)"
          : "Mensal";

      const session = await stripe.checkout.sessions.create({
        payment_method_types:
          paymentMethodType === "pix"
            ? (["pix", "card"] as any)
            : (["card"] as any),
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: `AprovAI PRO - Plano ${planTitle}`,
                description:
                  "Acesso Ilimitado ao Dissecador de Editais, Tutor IA 24/7, Simulados e Corretor de Redação.",
                images: [
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDUO9mD_G1BxvMIjwOdfww1Eh7VIImi4CYE9cJSc2IISOC7Mp2fdDJn8n9VZFVSmVDhJ5Q7E-LKrpHiN4fqyxuttXSRXaAwHZeQZYG_WO9CAr0C0glAFhR-iRhA1FmHY0iVxWgsUtPTZaL5ckNt5KgoOZU3kg1yTBoUBwZfBA5age9n7Ld3Bh-uMjceIKE5rk8bkBo3N0v0vExiZkp4HPfP3O6if2lYO0QWxBJITFpkgwOxDURjhBi0ow",
                ],
              },
              unit_amount: finalAmount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: customerEmail || undefined,
        success_url: `${origin}?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}?payment_status=cancelled`,
        metadata: {
          customerName: customerName || "",
          customerCpf: customerCpf || "",
          plan: currentPlan,
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        checkoutUrl: session.url,
        mode: "live_stripe",
      });
    }

    // Fallback Mode: Use the specific Stripe Payment Link for the selected plan
    const paymentLink =
      STRIPE_PAYMENT_LINKS[currentPlan] || STRIPE_PAYMENT_LINKS.anual;

    const mockOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    return NextResponse.json({
      orderId: mockOrderId,
      amount: finalAmount / 100,
      currency: "BRL",
      status: "ready",
      mode: "payment_link",
      checkoutUrl: paymentLink,
      message:
        "Redirecionando para o Stripe Checkout oficial.",
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao inicializar checkout com Stripe" },
      { status: 500 }
    );
  }
}

