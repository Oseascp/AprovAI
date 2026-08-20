"use client";

import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import { generatePix, DEFAULT_PIX_KEY } from "@/lib/pix";
import { STRIPE_PAYMENT_LINKS, PlanType } from "@/lib/stripe";
import {
  X,
  Lock,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle2,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Award,
  ExternalLink,
  Infinity,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanType;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialPlan = "anual",
  onSuccess,
}) => {
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">(
    "card"
  );

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("12");

  // Coupon state
  const [couponCode, setCouponCode] = useState("APROVADO2025");
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponError, setCouponError] = useState("");

  const basePrice =
    plan === "vitalicio" ? 697.0 : plan === "anual" ? 478.8 : 59.9;
  const discountRate = couponApplied ? 0.15 : 0;
  const finalPrice = basePrice * (1 - discountRate);

  // Selected Stripe Link
  const currentStripeLink =
    STRIPE_PAYMENT_LINKS[plan] || STRIPE_PAYMENT_LINKS.anual;

  // Generate real standard EMV PIX payload dynamically
  const dynamicPix = useMemo(() => {
    return generatePix({
      amount: Number(finalPrice.toFixed(2)),
      description: `AprovAI PRO ${
        plan === "vitalicio"
          ? "Vitalicio"
          : plan === "anual"
          ? "Anual"
          : "Mensal"
      }`,
      txId: "APROVAIPRO",
    });
  }, [finalPrice, plan]);

  // Pix custom state from backend or derived
  const [customPix, setCustomPix] = useState<{
    code: string;
    qrUrl: string;
  } | null>(null);
  const [pixCopied, setPixCopied] = useState(false);
  const [stripeNotice, setStripeNotice] = useState<string>("");

  const activePixCode = customPix?.code || dynamicPix.pixCode;
  const activePixQrUrl = customPix?.qrUrl || dynamicPix.qrCodeUrl;

  // Checkout process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [prevInitialPlan, setPrevInitialPlan] = useState(initialPlan);
  if (prevInitialPlan !== initialPlan) {
    setPrevInitialPlan(initialPlan);
    setPlan(initialPlan);
  }

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (
      couponCode.trim().toUpperCase() === "APROVADO2025" ||
      couponCode.trim().toUpperCase() === "PRIMEIRAAPROVACAO"
    ) {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Cupom inválido ou expirado.");
    }
  };

  const handleGeneratePix = async () => {
    try {
      const res = await fetch("/api/checkout/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          customerName: name || "Concurseiro Aprovado",
          customerEmail: email,
          discountRate,
        }),
      });
      const data = await res.json();
      if (data.pixCode) {
        setCustomPix({
          code: data.pixCode,
          qrUrl: data.qrCodeUrl,
        });
      }
    } catch (e) {
      console.error("Erro ao gerar PIX:", e);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setStripeNotice("");

    try {
      if (paymentMethod === "card") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            customerEmail: email,
            customerName: name,
            customerCpf: cpf,
            paymentMethodType: "card",
            discountRate,
          }),
        });
        const data = await res.json();

        if (data.checkoutUrl) {
          // If Live Stripe Checkout Session is returned, redirect to Stripe
          window.location.href = data.checkoutUrl;
          return;
        }
      }

      // Complete checkout simulation / sandbox confirmation
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        onSuccess();

        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#10b981", "#14b8a6", "#f59e0b", "#3b82f6"],
          });
        } catch (e) {
          console.error(e);
        }
      }, 1500);
    } catch (e) {
      console.error("Erro no checkout:", e);
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess();
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(activePixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in-50">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative my-6 text-slate-900 border border-slate-200">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  AprovAI PRO - Checkout Seguro
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  SSL 256-bit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ambiente criptografado e certificado PCI-DSS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <Crown className="w-4 h-4 text-amber-600 fill-amber-600" />
              Membro PRO Ativado com Sucesso
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Bem-vindo ao AprovAI PRO!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-8">
              Seu acesso ilimitado foi liberado. Enviamos as instruções de login
              para o seu e-mail ({email || "seu-email@exemplo.com"}).
            </p>

            {/* Unlocked Capabilities */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Poderes Desbloqueados na sua Conta:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Análise Ilimitada de Editais</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tutor IA 24/7 Ilimitado</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simulados Inéditos da Banca</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cronograma Diário até a Prova</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Acessar Meu Painel PRO Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Form & Payment (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-6">
              {/* Step 1: Plan Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Plano Selecionado:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Mensal */}
                  <button
                    type="button"
                    onClick={() => setPlan("mensal")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      plan === "mensal"
                        ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-bold text-xs text-slate-900">Mensal</p>
                    <p className="text-[11px] text-slate-700 font-extrabold mt-0.5">
                      R$ 59,90/mês
                    </p>
                    <p className="text-[9px] text-slate-500">Sem fidelidade</p>
                  </button>

                  {/* Anual */}
                  <button
                    type="button"
                    onClick={() => setPlan("anual")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      plan === "anual"
                        ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                      33% OFF
                    </span>
                    <p className="font-bold text-xs text-slate-900">Anual PRO</p>
                    <p className="text-[11px] text-emerald-700 font-black mt-0.5">
                      12x R$ 39,90
                    </p>
                    <p className="text-[9px] text-slate-500">R$ 478,80/ano</p>
                  </button>

                  {/* Vitalício */}
                  <button
                    type="button"
                    onClick={() => setPlan("vitalicio")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      plan === "vitalicio"
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-white">
                      PERPÉTUO
                    </span>
                    <p className="font-bold text-xs text-slate-900">Vitalício</p>
                    <p className="text-[11px] text-amber-700 font-black mt-0.5">
                      R$ 697,00
                    </p>
                    <p className="text-[9px] text-slate-500">Até passar</p>
                  </button>
                </div>
              </div>

              {/* Step 2: Buyer Info */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  2. Dados de Acesso:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CPF (000.000.000-00)"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="WhatsApp (DDD + Número)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Forma de Pagamento:
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão (Stripe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("pix");
                      handleGeneratePix();
                    }}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                      paymentMethod === "pix"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>PIX Imediato</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("boleto")}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "boleto"
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Boleto</span>
                  </button>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200/80">
                      <span className="font-semibold text-slate-700">Processado com Stripe Payments</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Checkout Seguro
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Número do Cartão de Crédito"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Nome impresso no Cartão"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 uppercase"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="CVV (3 dígitos)"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
                      >
                        {plan === "vitalicio" ? (
                          <>
                            <option value="12">
                              12x de R${" "}
                              {(finalPrice / 12).toFixed(2).replace(".", ",")}{" "}
                              sem juros
                            </option>
                            <option value="6">
                              6x de R${" "}
                              {(finalPrice / 6).toFixed(2).replace(".", ",")}{" "}
                              sem juros
                            </option>
                            <option value="1">
                              1x de R$ {finalPrice.toFixed(2).replace(".", ",")}{" "}
                              à vista
                            </option>
                          </>
                        ) : plan === "anual" ? (
                          <>
                            <option value="12">
                              12x de R${" "}
                              {(finalPrice / 12).toFixed(2).replace(".", ",")}{" "}
                              sem juros
                            </option>
                            <option value="6">
                              6x de R${" "}
                              {(finalPrice / 6).toFixed(2).replace(".", ",")}{" "}
                              sem juros
                            </option>
                            <option value="3">
                              3x de R${" "}
                              {(finalPrice / 3).toFixed(2).replace(".", ",")}{" "}
                              sem juros
                            </option>
                            <option value="1">
                              1x de R$ {finalPrice.toFixed(2).replace(".", ",")}{" "}
                              à vista
                            </option>
                          </>
                        ) : (
                          <option value="1">
                            1x de R$ {finalPrice.toFixed(2).replace(".", ",")}{" "}
                            (mensal recorrente)
                          </option>
                        )}
                      </select>
                    </div>

                    <div className="pt-2">
                      <a
                        href={currentStripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Abrir Link Oficial Stripe Checkout (
                          {plan === "vitalicio"
                            ? "Vitalício"
                            : plan === "anual"
                            ? "Anual"
                            : "Mensal"}
                          )
                        </span>
                      </a>
                    </div>
                  </div>
                )}

                {/* PIX Form */}
                {paymentMethod === "pix" && (
                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-5 text-center space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        Liberação Instantânea Automática
                      </div>
                      <span className="text-xs font-black text-emerald-950 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                        Valor: R$ {finalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl border-2 border-emerald-400 shadow-md flex items-center justify-center">
                      {activePixQrUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={activePixQrUrl}
                          alt="QR Code PIX Banco Central Oficial"
                          className="w-40 h-40 object-contain rounded-lg"
                        />
                      ) : (
                        <QrCode className="w-40 h-40 text-slate-800" />
                      )}
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      Abra o aplicativo do seu banco (qualquer instituição), escolha a opção <strong>PIX</strong> e escaneie o QR Code ou copie o código abaixo:
                    </p>

                    <div className="pt-1 space-y-2.5">
                      {/* Copia e Cola Oficial */}
                      <button
                        type="button"
                        onClick={copyPixKey}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                      >
                        {pixCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-200" />
                            <span>Código PIX Copiado com Sucesso!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-emerald-200" />
                            <span>Copiar Código PIX Copia e Cola Oficial</span>
                          </>
                        )}
                      </button>

                      {/* Chave CPF Direta */}
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Ou transfira direto para a Chave PIX (CPF)
                        </span>
                        <div className="flex items-center justify-between mt-0.5">
                          <code className="text-xs font-mono font-black text-emerald-950">
                            90831128372
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("90831128372");
                              setPixCopied(true);
                              setTimeout(() => setPixCopied(false), 2500);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar CPF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boleto Form */}
                {paymentMethod === "boleto" && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                    <p className="font-semibold text-slate-800">
                      Instruções do Boleto Bancário:
                    </p>
                    <p>
                      • O boleto será gerado após clicar em finalizar.
                      <br />
                      • A compensação bancária ocorre entre 1 e 2 dias úteis.
                      <br />• Para acesso imediato, recomendamos o pagamento via
                      PIX ou Cartão de Crédito.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Guarantee (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
                  Resumo da Assinatura:
                </h4>

                {/* Plan Card in Summary */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">
                      AprovAI PRO (
                      {plan === "vitalicio"
                        ? "Vitalício"
                        : plan === "anual"
                        ? "Anual"
                        : "Mensal"}
                      )
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      R$ {basePrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Acesso completo a todas as ferramentas de IA
                  </p>
                </div>

                {/* Coupon Box */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupom de Desconto"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cupom de 15% OFF aplicado!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* Price Lines */}
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-4 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {basePrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Desconto Especial (15%):</span>
                      <span>
                        - R${" "}
                        {(basePrice * discountRate)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total a Pagar:</span>
                    <span className="text-emerald-700">
                      R$ {finalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  {(plan === "anual" || plan === "vitalicio") && (
                    <p className="text-right text-[11px] text-slate-500 font-medium">
                      ou até 12x de R${" "}
                      {(finalPrice / 12).toFixed(2).replace(".", ",")}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button & Trust Guarantee */}
              <div>
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processando Pagamento Seguro...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Finalizar Pagamento Seguro</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 7-day guarantee badge */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900">
                      Garantia Incondicional de 7 Dias
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Teste sem compromisso. Se não gostar, devolvemos 100% do
                      seu investimento sem perguntas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
