import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { message: "Stripe não configurado no servidor" },
      { status: 200 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `✅ Pagamento aprovado para: ${session.customer_email}, Valor: ${session.amount_total}`
      );
      break;
    }
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(`✅ PaymentIntent aprovado: ${paymentIntent.id}`);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
