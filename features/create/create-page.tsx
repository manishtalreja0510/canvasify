"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, ArrowRight, CheckCircle2, Sliders, Package,
  Download, Sparkles, Palette, Clock, ArrowLeft, Tag, Loader2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, SUBSCRIPTION } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generatePBN } from "@/lib/pbn-renderer";

type Step = "upload" | "customize" | "preview" | "checkout";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "upload", label: "Upload Photo", icon: Upload },
  { id: "customize", label: "Customize", icon: Sliders },
  { id: "preview", label: "Preview", icon: Sparkles },
  { id: "checkout", label: "Order", icon: Package },
];

const PALETTE_SIZES = [
  { value: 12, label: "12 Colors", description: "Simple • Beginner friendly", recommended: false },
  { value: 24, label: "24 Colors", description: "Balanced • Most popular", recommended: true },
  { value: 36, label: "36 Colors", description: "Detailed • Advanced", recommended: false },
];

const CANVAS_SIZES = [
  { value: "30x40", label: "30×40 cm", description: "Small format" },
  { value: "40x50", label: "40×50 cm", description: "Standard (recommended)", recommended: true },
  { value: "50x60", label: "50×60 cm", description: "Large format" },
  { value: "60x80", label: "60×80 cm", description: "Extra large" },
];

export function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paletteSize, setPaletteSize] = useState(24);
  const [canvasSize, setCanvasSize] = useState("40x50");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[1].id);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [processError, setProcessError] = useState("");
  const [pbnSvg, setPbnSvg] = useState<string | null>(null);
  const [pbnGenerating, setPbnGenerating] = useState(false);
  const [pbnError, setPbnError] = useState("");

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  });

  const handleProcess = async () => {
    if (!photoFile) return;
    setProcessing(true);
    setProcessError("");

    try {
      const fd = new FormData();
      fd.append("image", photoFile);
      fd.append("palette_size", String(paletteSize));
      fd.append("canvas_size", canvasSize);
      fd.append("title", photoFile.name.replace(/\.[^.]+$/, "") || "My Artwork");

      const res = await fetch("/api/process", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login?redirect=/create");
          return;
        }
        throw new Error(data.error || "Processing failed");
      }

      if (data.id) setProjectId(data.id);
    } catch (err: any) {
      setProcessError(err.message || "Processing failed. You can still continue.");
    } finally {
      setProcessing(false);
      setStep("customize");
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);
  const selectedProductData = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[1];

  const downloadPreview = useCallback(() => {
    if (!pbnSvg) return;
    const blob = new Blob([pbnSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvasify-preview.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [pbnSvg]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: selectedProduct, couponCode: couponCode.trim(), validateOnly: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon");
        setCouponDiscount(0);
        setCouponApplied("");
      } else if (data.discount > 0) {
        setCouponDiscount(data.discount);
        setCouponApplied(couponCode.trim().toUpperCase());
        setCouponError("");
      } else {
        setCouponError("Coupon not recognised");
        setCouponDiscount(0);
        setCouponApplied("");
      }
    } catch {
      setCouponError("Could not apply coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setPaymentError("");
    setPaymentLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Check your connection.");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: selectedProduct, couponCode: couponApplied || undefined, projectId: projectId || undefined }),
      });
      const orderData = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth/login?redirect=/create`);
          return;
        }
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      const { razorpay_order_id, amount, currency, key } = orderData;

      const options = {
        key,
        amount,
        currency,
        name: "Canvasify",
        description: `${selectedProductData.name} — ${paletteSize} colors, ${canvasSize}cm`,
        image: "/logo.png",
        order_id: razorpay_order_id,
        prefill: {},
        theme: { color: "#7C5CFF" },
        modal: { ondismiss: () => setPaymentLoading(false) },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                productType: selectedProduct,
                amount,
                originalAmount: orderData.original_amount,
                discount: orderData.discount,
                couponCode: couponApplied,
                projectId: projectId || undefined,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            router.push(`/payment/success?order_id=${verifyData.orderId}&product=${selectedProduct}`);
          } catch (err: any) {
            setPaymentError(err.message || "Payment verification failed. Contact support.");
            setPaymentLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setPaymentError(response.error?.description || "Payment failed. Please try again.");
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || "Something went wrong. Please try again.");
      setPaymentLoading(false);
    }
  };

  const finalPrice = selectedProductData.price - couponDiscount;

  return (
    <div className="min-h-screen pt-24 pb-24 relative">
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge-premium mb-3 inline-block">AI Creation Studio</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Create Your Artwork</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isComplete = i < currentStepIndex;
            const isActive = i === currentStepIndex;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isComplete
                      ? "bg-[#00D084] text-white"
                      : isActive
                      ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                      : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#94A3B8]"
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-white" : "text-[#94A3B8]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-2 h-px max-w-[80px] ${i < currentStepIndex ? "bg-[#00D084]" : "bg-[rgba(255,255,255,0.1)]"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Photo</h2>
                <p className="text-[#94A3B8] mb-6">Choose the memory you want to transform. High resolution photos work best.</p>

                {!photo ? (
                  <div
                    {...getRootProps()}
                    className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-5 p-12 cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? "border-[#7C5CFF] bg-[rgba(124,92,255,0.08)]"
                        : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(124,92,255,0.4)] hover:bg-[rgba(124,92,255,0.04)]"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(124,92,255,0.2)] to-[rgba(0,229,255,0.1)] flex items-center justify-center">
                      <Upload className="w-9 h-9 text-[#7C5CFF]" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-white mb-2">
                        {isDragActive ? "Drop your photo here" : "Drag & drop your photo"}
                      </p>
                      <p className="text-[#94A3B8] mb-4">or click to browse files</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["JPG", "PNG", "HEIC", "WEBP"].map((f) => (
                          <span key={f} className="text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 text-[#94A3B8]">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-3">Max file size: 25MB • Minimum resolution: 2MP</p>
                    </div>

                    {/* Best photo types */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {["💑 Weddings", "🐕 Pets", "👨‍👩‍👧‍👦 Family", "🌅 Travel", "🏡 Homes"].map((t) => (
                        <div key={t} className="text-xs px-3 py-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-xl text-[#94A3B8]">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="relative rounded-2xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Upload preview" className="w-full max-h-80 object-cover" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Photo uploaded
                        </Badge>
                        <button
                          onClick={() => { setPhoto(null); setPhotoFile(null); }}
                          className="text-xs bg-[rgba(0,0,0,0.7)] text-white px-3 py-1.5 rounded-xl hover:bg-[rgba(0,0,0,0.9)]"
                        >
                          Change photo
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-[rgba(0,208,132,0.06)] border border-[rgba(0,208,132,0.2)] rounded-xl">
                      <p className="text-sm text-[#00D084] font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Great photo! Our AI will create an excellent paint-by-number template.
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-1 ml-6">
                        File: {photoFile?.name} • {((photoFile?.size || 0) / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                )}

                {processError && (
                  <div className="mt-3 p-3 rounded-xl bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {processError}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="gradient"
                    size="lg"
                    disabled={!photo}
                    loading={processing}
                    onClick={handleProcess}
                    iconRight={processing ? undefined : <ArrowRight className="w-4 h-4" />}
                  >
                    {processing ? "AI Processing..." : "Process with AI"}
                  </Button>
                </div>

                {processing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-[rgba(124,92,255,0.06)] border border-[rgba(124,92,255,0.2)] rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                        <Sparkles className="w-4 h-4 text-[#7C5CFF]" />
                      </motion.div>
                      <span className="text-sm text-white font-medium">AI is analyzing your photo...</span>
                    </div>
                    {["Detecting regions", "Mapping colors", "Generating palette", "Creating template"].map((s, i) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.6 }}
                        className="flex items-center gap-2 text-xs text-[#94A3B8] mb-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#00D084]" />
                        {s}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Customize */}
          {step === "customize" && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Preview */}
                <div className="lg:col-span-2 bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-5 sticky top-24 h-fit">
                  <div className="relative rounded-2xl overflow-hidden aspect-square mb-4">
                    {photo && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="Preview" className="w-full h-full object-cover" style={{ filter: "saturate(0.3) contrast(1.1)" }} />
                        <div className="absolute inset-0"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 20px)`,
                          }}
                        />
                        {[{ t: "15%", l: "22%", n: "1" }, { t: "45%", l: "55%", n: "5" }, { t: "65%", l: "18%", n: "3" }, { t: "30%", l: "70%", n: "2" }].map(({ t, l, n }) => (
                          <div key={n} className="absolute w-5 h-5 rounded-full bg-white text-[#060816] text-[9px] font-bold flex items-center justify-center" style={{ top: t, left: l }}>
                            {n}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-[#7C5CFF]" />
                    <span className="text-sm font-medium text-white">Palette Preview ({paletteSize} colors)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: paletteSize }, (_, i) => (
                      <div key={i} className="w-6 h-6 rounded-md border border-[rgba(255,255,255,0.1)]"
                        style={{ background: `hsl(${i * (360 / paletteSize)}, 55%, 45%)` }} />
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="lg:col-span-3 flex flex-col gap-5">
                  <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-6">
                    <h2 className="text-xl font-bold text-white mb-5">Customize Your Template</h2>

                    {/* Palette size */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-white mb-3 block">Color Palette Size</label>
                      <div className="flex flex-col gap-2">
                        {PALETTE_SIZES.map((p) => (
                          <button
                            key={p.value}
                            onClick={() => setPaletteSize(p.value)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              paletteSize === p.value
                                ? "border-[rgba(124,92,255,0.5)] bg-[rgba(124,92,255,0.08)]"
                                : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(124,92,255,0.2)]"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paletteSize === p.value ? "border-[#7C5CFF] bg-[#7C5CFF]" : "border-[rgba(255,255,255,0.2)]"
                            }`}>
                              {paletteSize === p.value && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-white text-sm">{p.label}</span>
                              <p className="text-xs text-[#94A3B8]">{p.description}</p>
                            </div>
                            {p.recommended && (
                              <Badge variant="default" className="text-[10px] py-0.5">Recommended</Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Canvas size */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-white mb-3 block">Canvas Size</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CANVAS_SIZES.map((cs) => (
                          <button
                            key={cs.value}
                            onClick={() => setCanvasSize(cs.value)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              canvasSize === cs.value
                                ? "border-[rgba(124,92,255,0.5)] bg-[rgba(124,92,255,0.08)]"
                                : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(124,92,255,0.2)]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-semibold text-white text-sm">{cs.label}</span>
                              {cs.recommended && (
                                <Badge variant="default" className="text-[9px] py-0">Best</Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#94A3B8]">{cs.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="glass" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep("upload")}>
                        Back
                      </Button>
                      <Button
                        variant="gradient"
                        size="md"
                        className="flex-1"
                        iconRight={<ArrowRight className="w-4 h-4" />}
                        onClick={async () => {
                          if (!photo) return;
                          setStep("preview");
                          setPbnSvg(null);
                          setPbnError("");
                          setPbnGenerating(true);
                          try {
                            const result = await generatePBN(photo, paletteSize, { watermark: true });
                            setPbnSvg(result.svg);
                          } catch (err: any) {
                            setPbnError(err.message || "Failed to generate preview");
                          } finally {
                            setPbnGenerating(false);
                          }
                        }}
                      >
                        See Preview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D084] to-[#00A062] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Your Preview is Ready!</h2>
                  <p className="text-[#94A3B8]">Here&apos;s how your personalized paint-by-number will look</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Original */}
                  <div>
                    <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Original Photo</p>
                    <div className="rounded-2xl overflow-hidden aspect-square bg-[rgba(255,255,255,0.03)]">
                      {photo && <img src={photo} alt="Original" className="w-full h-full object-cover" />}
                    </div>
                  </div>
                  {/* PBN Preview */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Paint-By-Number Preview</p>
                      {pbnSvg && !pbnGenerating && <Badge variant="success" className="text-[10px] py-0">AI Generated</Badge>}
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-square bg-white relative flex items-center justify-center">
                      {pbnGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
                          <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
                          <p className="text-sm text-[#94A3B8]">Generating paint-by-number…</p>
                        </div>
                      )}
                      {pbnSvg && !pbnGenerating && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(pbnSvg)}`}
                          alt="Paint-by-Number Preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                      {pbnError && !pbnGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <p className="text-red-400 text-sm text-center">{pbnError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Template info */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-4">
                  {[
                    { label: "Palette Size", value: `${paletteSize} colors` },
                    { label: "Canvas Size", value: `${canvasSize} cm` },
                    { label: "Sections", value: "~847" },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="text-xs text-[#94A3B8]">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="glass" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep("customize")}>
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    icon={pbnGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    className="flex-1"
                    onClick={downloadPreview}
                    disabled={!pbnSvg || pbnGenerating}
                  >
                    {pbnGenerating ? "Generating…" : "Download Preview (Free)"}
                  </Button>
                  <Button
                    variant="gradient"
                    size="md"
                    className="flex-1"
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setStep("checkout")}
                  >
                    Order This
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Checkout */}
          {step === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Products */}
                <div className="lg:col-span-3">
                  <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Choose Your Product</h2>
                    <div className="flex flex-col gap-4">
                      {PRODUCTS.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProduct(product.id)}
                          className={`text-left p-4 rounded-2xl border transition-all ${
                            selectedProduct === product.id
                              ? "border-[rgba(124,92,255,0.5)] bg-[rgba(124,92,255,0.06)]"
                              : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(124,92,255,0.2)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedProduct === product.id ? "border-[#7C5CFF] bg-[#7C5CFF]" : "border-[rgba(255,255,255,0.2)]"
                              }`}>
                                {selectedProduct === product.id && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{product.name}</span>
                                  {product.popular && (
                                    <Badge variant="new" className="text-[10px] py-0.5">Popular</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-[#94A3B8] mt-0.5">{product.description}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xl font-bold text-white">{formatCurrency(product.price)}</p>
                              <p className="text-xs text-[#94A3B8]">one-time</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3 ml-8">
                            {product.features.slice(0, 3).map((f) => (
                              <span key={f} className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-[#00D084]" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="lg:col-span-2">
                  <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>

                    {/* Preview thumb */}
                    <div className="rounded-xl overflow-hidden h-24 bg-white relative mb-4">
                      {pbnSvg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(pbnSvg)}`}
                          alt="Template preview"
                          className="w-full h-full object-contain"
                        />
                      ) : photo ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo} alt="Template" className="w-full h-full object-cover opacity-40" style={{ filter: "saturate(0) contrast(1.1)" }} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Badge variant="glass" className="text-xs">Your Template</Badge>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 mb-5 text-sm">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>{selectedProductData.name}</span>
                        <span className="text-white">{formatCurrency(selectedProductData.price)}</span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Palette: {paletteSize} colors</span>
                        <span className="text-white">Included</span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Canvas: {canvasSize}cm</span>
                        <span className="text-white">Included</span>
                      </div>
                      {selectedProductData.id === "canvas_kit" && (
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Shipping</span>
                          <span className="text-[#00D084]">Free</span>
                        </div>
                      )}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-[#00D084]">
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {couponApplied}</span>
                          <span>−{formatCurrency(couponDiscount)}</span>
                        </div>
                      )}
                      <div className="border-t border-[rgba(255,255,255,0.08)] pt-3 flex justify-between">
                        <span className="font-bold text-white">Total</span>
                        <span className="font-bold text-white text-lg">{formatCurrency(finalPrice)}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="flex flex-col gap-1 mb-5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                          disabled={!!couponApplied}
                          className="flex-1 h-9 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white text-xs placeholder:text-[#94A3B8] focus:outline-none disabled:opacity-50"
                        />
                        {couponApplied ? (
                          <Button variant="secondary" size="xs" onClick={() => { setCouponApplied(""); setCouponDiscount(0); setCouponCode(""); }}>
                            Remove
                          </Button>
                        ) : (
                          <Button variant="secondary" size="xs" onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}>
                            {couponLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                          </Button>
                        )}
                      </div>
                      {couponError && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{couponError}</p>}
                      {couponApplied && <p className="text-xs text-[#00D084]">Coupon applied! You save {formatCurrency(couponDiscount)}.</p>}
                    </div>

                    {paymentError && (
                      <div className="mb-3 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] text-xs text-red-400 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {paymentError}
                      </div>
                    )}

                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full mb-3"
                      onClick={handlePayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing…</>
                      ) : (
                        `Pay ${formatCurrency(finalPrice)}`
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-[10px] text-[#94A3B8]">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D084]" /> Secure checkout</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Instant delivery</span>
                    </div>

                    <button
                      onClick={() => setStep("preview")}
                      className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-white mt-3 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
