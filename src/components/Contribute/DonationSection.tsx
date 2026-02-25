"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const amountKeys = ["meal", "supplies", "transport", "family", "emergency"] as const;

export default function DonationSection() {
  const t = useTranslations("contribute.donation");
  const tDonation = useTranslations("donation");
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to copy text: ", err);
      }
    }
  }, []);

  const handlePayPalClick = useCallback(() => {
    window.open(
      "https://www.paypal.com/donate/?hosted_button_id=5ND9UES5EPQKY",
      "_blank"
    );
  }, []);

  const ibanLabel = tDonation("methods.sepa.details.iban").split(":")[0] || "IBAN";
  const beneficiaryLabel = tDonation("methods.sepa.details.beneficiary").split(":")[0] || "Beneficiary";
  
  return (
    <section id="donation-section" className="pt-16 md:pt-24 pb-16 md:pb-24 bg-background relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* CENTERED HEADER */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          
          {/* LEFT COLUMN: Impact Cards */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col h-full">
            <div className="grid sm:grid-cols-2 gap-4 xl:gap-5 flex-grow">
              {amountKeys.map((key) => {
                return (
                  <div
                    key={key}
                    className={cn(
                      "group relative flex flex-col p-6 rounded-lg border border-border bg-card overflow-hidden hover:border-border/80 hover:shadow-sm transition-all duration-300 text-left rtl:text-right",
                      key === "emergency" ? "sm:col-span-2" : ""
                    )}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto -mt-6 -mr-6 rtl:-ml-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

                    <div className="mb-6 flex items-baseline gap-1.5 relative z-10">
                      <span className="text-4xl font-black tracking-tight text-primary drop-shadow-sm">
                        {t(`amounts.${key}.value`)}
                      </span>
                      <span className="text-xl font-bold text-primary/60">
                        {t("currency")}
                      </span>
                    </div>
                    
                    <div className="relative z-10 flex-grow">
                      <h3 className="text-xl font-bold mb-2 text-foreground">
                        {t(`amounts.${key}.label`)}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {t(`amounts.${key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Methods */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-full">
            <div className="rounded-lg border border-border bg-card p-8 text-left rtl:text-right h-full flex flex-col shadow-sm">
              <div className="mb-8 shrink-0">
                <h3 className="text-2xl font-bold text-foreground mb-2">{t("paymentTitle")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("paymentSubtitle")}
                </p>
              </div>

              <div className="flex flex-col gap-4 flex-grow">
                
                {/* Bank Transfer */}
                <div className="p-5 border border-border/60 rounded-xl bg-muted/20 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm">
                      <Image src="/images/icons/santander-icon.svg" alt="Bank" width={20} height={20} className="object-contain" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">{tDonation("methods.sepa.title")}</h4>
                  </div>
                  
                  <div className="space-y-4 ml-14 rtl:ml-0 rtl:mr-14">
                    {/* IBAN */}
                    <div className="flex flex-col group rtl:text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{ibanLabel}</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[15px] font-bold text-foreground" dir="ltr">
                          ES81 0049 0401 1122 1027 2614
                        </span>
                        <button 
                          onClick={() => handleCopy("ES8100490401112210272614", "iban")} 
                          className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground opacity-40 hover:opacity-100 focus:opacity-100 transition-all rounded-md hover:bg-muted/50 h-8 w-8 flex items-center justify-center rtl:mr-auto rtl:ml-0"
                          aria-label="Copy IBAN"
                        >
                          {copiedField === "iban" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Beneficiary */}
                    <div className="flex flex-col group rtl:text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{beneficiaryLabel}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-bold text-foreground">
                          Asociación Nacional de Argelinos en España
                        </span>
                        <button 
                          onClick={() => handleCopy("Asociación Nacional de Argelinos en España", "beneficiary")} 
                          className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground opacity-40 hover:opacity-100 focus:opacity-100 transition-all rounded-md hover:bg-muted/50 h-8 w-8 flex items-center justify-center rtl:mr-auto rtl:ml-0"
                          aria-label="Copy Beneficiary"
                        >
                          {copiedField === "beneficiary" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-5 border border-border/60 rounded-xl bg-muted/20 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm">
                      <Image src="/images/icons/paypal-logo.svg" alt="PayPal" width={20} height={20} className="object-contain" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">{tDonation("methods.paypal.title")}</h4>
                  </div>
                  <div className="ml-14 rtl:ml-0 rtl:mr-14">
                    <Button 
                      onClick={handlePayPalClick} 
                      className="w-auto h-10 rounded-md text-sm font-semibold gap-2 bg-[#003087] hover:bg-[#001c52] text-white transition-all hover:scale-[1.01] px-6" 
                    >
                      {tDonation("methods.paypal.button")}
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </Button>
                  </div>
                </div>

                {/* Bizum */}
                <div className="p-5 border border-border/60 rounded-xl bg-muted/20 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border/40 shadow-sm">
                      <Image src="/images/icons/bizum-logo.svg" alt="Bizum" width={20} height={20} className="object-contain" />
                    </div>
                    <h4 className="font-semibold text-foreground text-lg">{tDonation("methods.bizum.title")}</h4>
                  </div>
                  <div className="flex items-center justify-between group">
                    <span className="font-mono text-[17px] font-bold tracking-wide text-foreground ml-14 rtl:ml-0 rtl:mr-14" dir="ltr">
                      654 155 924
                    </span>
                    <button 
                      onClick={() => handleCopy("654155924", "bizum")} 
                      className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground opacity-40 hover:opacity-100 focus:opacity-100 transition-all rounded-md hover:bg-muted/50 h-8 w-8 flex items-center justify-center rtl:mr-auto rtl:ml-0"
                      aria-label="Copy Bizum number"
                    >
                      {copiedField === "bizum" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
