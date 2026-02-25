"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { X, Copy, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "./button";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const t = useTranslations("donation");
  const tNav = useTranslations("nav");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSepaDetails, setShowSepaDetails] = useState(false);
  const [showBizumDetails, setShowBizumDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to copy text: ", err);
      }
    }
  }, []);

  const handlePayPalClick = useCallback(() => {
    window.open("https://www.paypal.com/donate/?hosted_button_id=5ND9UES5EPQKY", "_blank");
  }, []);

  if (!isOpen || !mounted) return null;


  const modalContent = (
    <div 
      className="fixed inset-0 z-[100]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1
        }}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative flex items-center justify-center p-4"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%'
        }}
      >
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-4xl lg:max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{ margin: 'auto' }}>
        {/* Close Button - positioned absolutely in top right/left corner based on direction */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 end-4 z-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-6 w-6" />
        </Button>
        
        {/* Header */}
        <div className="p-6 lg:p-7 border-b border-gray-200 dark:border-gray-700 text-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-7">
          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 mb-8">
            {/* PayPal */}
            <div className="group h-full">
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-blue-500/50">
                <div className="flex items-start mb-4">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent" style={{ width: '48px', height: '48px' }}>
                    <Image 
                      src="/images/icons/paypal-logo.svg"
                      alt="PayPal"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="ms-4 flex-1 text-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("methods.paypal.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("methods.paypal.description")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handlePayPalClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
                >
                  {t("methods.paypal.button")}
                </Button>
              </div>
            </div>

            {/* Bizum */}
            <div className="group h-full">
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#0a9da2]/50">
                <div className="flex items-start mb-4">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent" style={{ width: '48px', height: '48px' }}>
                    <Image 
                      src="/images/icons/bizum-logo.svg"
                      alt="Bizum"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="ms-4 flex-1 text-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("methods.bizum.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("methods.bizum.description")}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (showBizumDetails) {
                      setShowBizumDetails(false);
                    } else {
                      setShowBizumDetails(true);
                      setShowSepaDetails(false);
                    }
                  }}
                  className="w-full text-white mt-auto"
                  style={{ backgroundColor: '#078387' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#066b6f'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#078387'}
                >
                  {t("methods.bizum.button")}
                </Button>
              </div>
            </div>

            {/* Bizum Details - Mobile only (appears right after Bizum card) */}
            {showBizumDetails && (
              <div className="md:hidden col-span-1 px-4 py-4 text-start animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  {t("methods.bizum.details.title")}
                </h3>
                <div className="flex flex-col group">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("methods.bizum.details.phone").split(":")[0]}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg text-gray-900 dark:text-gray-100 font-semibold font-mono tracking-wider break-all">
                      {t("methods.bizum.details.phone").split(":")[1]?.trim() || "654 155 924"}
                    </p>
                    <button
                      onClick={() => handleCopy("654155924", "bizum-phone")}
                      className="p-2 shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                      title="Copy"
                    >
                      {copiedField === "bizum-phone" ? <Check className="h-5 w-5 text-green-600 dark:text-green-400" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer (Santander) */}
            <div className="group h-full">
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-red-500/50">
                <div className="flex items-start mb-4">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent" style={{ width: '48px', height: '48px' }}>
                    <Image 
                      src="/images/icons/santander-icon.svg"
                      alt="Santander Bank"
                      width={28}
                      height={28}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="ms-4 flex-1 text-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("methods.sepa.title")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("methods.sepa.description")}
                    </p>
                  </div>
                </div>
                  <Button
                    onClick={() => {
                      if (showSepaDetails) {
                        setShowSepaDetails(false);
                      } else {
                        setShowSepaDetails(true);
                        setShowBizumDetails(false);
                      }
                    }}
                    className="w-full text-white mt-auto"
                    style={{ backgroundColor: '#EC0000' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C80000'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EC0000'}
                  >
                    {t("methods.sepa.button")}
                  </Button>
              </div>
            </div>
          </div>

          {/* Bizum Details - Desktop only (appears at bottom) */}
          {showBizumDetails && (
            <div className="hidden md:block mb-8 px-6 text-start animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
                {t("methods.bizum.details.title")}
              </h3>
              <div className="flex flex-col group">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("methods.bizum.details.phone").split(":")[0]}
                </span>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-semibold font-mono tracking-wider break-all">
                    {t("methods.bizum.details.phone").split(":")[1]?.trim() || "654 155 924"}
                  </p>
                  <button
                    onClick={() => handleCopy("654155924", "bizum-phone")}
                    className="p-2 shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                    title="Copy"
                  >
                    {copiedField === "bizum-phone" ? <Check className="h-5 w-5 text-green-600 dark:text-green-400" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEPA Details */}
          {showSepaDetails && (
            <div className="mb-8 px-6 text-start animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
                {t("methods.sepa.details.title")}
              </h3>
              <div className="space-y-8">
                <div className="flex flex-col group">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("methods.sepa.details.iban").split(":")[0]}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-semibold tracking-wide break-all font-mono">
                      {t("methods.sepa.details.iban").split(":")[1]?.trim() || "ES81 0049 0401 1122 1027 2614"}
                    </p>
                    <button
                      onClick={() => handleCopy("ES8100490401112210272614", "iban")}
                      className="p-2 shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                      title="Copy IBAN"
                    >
                      {copiedField === "iban" ? <Check className="h-5 w-5 text-green-600 dark:text-green-400" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col group">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("methods.sepa.details.beneficiary").split(":")[0]}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 font-semibold">
                      {t("methods.sepa.details.beneficiary").split(":")[1]?.trim() || "Asociación Nacional de Argelinos en España"}
                    </p>
                    <button
                      onClick={() => handleCopy("Asociación Nacional de Argelinos en España", "beneficiary")}
                      className="p-2 shrink-0 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                      title="Copy Beneficiary"
                    >
                      {copiedField === "beneficiary" ? <Check className="h-5 w-5 text-green-600 dark:text-green-400" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 lg:p-7 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/contribute" 
            onClick={onClose}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {tNav("contribute")} &rarr;
          </Link>
          <Button variant="outline" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}