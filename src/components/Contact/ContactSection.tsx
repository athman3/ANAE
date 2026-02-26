"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/constants/socialLinks";

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const t = useTranslations("contact");
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentError, setConsentError] = useState(false);
  
  // En RTL, on inverse l'ordre pour compenser le rtl:space-x-reverse
  const socialLinks = useMemo(
    () => (isRTL ? [...SOCIAL_LINKS].reverse() : SOCIAL_LINKS),
    [isRTL]
  );
  


  const contactInfo: ContactInfo[] = useMemo(() => [
    {
      icon: Mail,
      title: t("info.email.title"),
      value: t("info.email.value"),
      description: t("info.email.description"),
    },
    {
      icon: Phone,
      title: t("info.phone.title"),
      value: t("info.phone.value"),
      description: t("info.phone.description"),
    },
    {
      icon: MapPin,
      title: t("info.address.title"),
      value: t("info.address.value"),
      description: t("info.address.description"),
    },
  ], [t]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentAccepted) {
      setConsentError(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setConsentError(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, consent: consentAccepted }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setConsentAccepted(false);

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting form:', err);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, consentAccepted]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form - First on mobile, second on desktop */}
          <div className="group relative order-1 lg:order-2">
            <div className="relative p-8">
              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 flex items-center space-x-3 bg-green-50 border border-green-200 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    {t("form.success")}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 flex items-center space-x-3 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="h-5 w-5 flex-shrink-0 text-red-600">✕</div>
                  <p className="text-sm font-medium text-red-800">
                    {t("form.error")}: {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {t("form.fields.name")}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder={t("form.placeholders.name")}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      {t("form.fields.email")}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder={t("form.placeholders.email")}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("form.fields.subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="h-12 w-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder={t("form.placeholders.subject")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("form.fields.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                    placeholder={t("form.placeholders.message")}
                  />
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => {
                        setConsentAccepted(e.target.checked);
                        if (e.target.checked) setConsentError(false);
                      }}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t("form.consent.label")}{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                      >
                        {t("form.consent.link")}
                      </Link>
                    </span>
                  </label>
                  {consentError && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {t("form.consent.required")}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative h-14 w-full bg-primary text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>{t("form.sending")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="h-5 w-5" />
                      <span>{t("form.submit")}</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information Cards - Second on mobile, first on desktop */}
          <div className="space-y-6 pt-8 order-2 lg:order-1 flex flex-col justify-center">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative p-6">
                  <div className="flex items-start space-x-4">
                    {/* Icon Container */}
                    <div className="flex-shrink-0 p-3">
                      <info.icon className="h-6 w-6 text-foreground" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="mb-1 text-lg font-semibold text-foreground">
                        {info.title}
                      </h4>
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-base font-medium text-foreground">
                          {info.value}
                        </p>
                        {/* Copy Button for Email and Phone */}
                        {(info.title === t("info.email.title") || info.title === t("info.phone.title")) && (
                          <button
                            onClick={() => {
                              // Remove spaces from phone number when copying
                              const valueToCopy = info.title === t("info.phone.title") 
                                ? info.value.replace(/\s/g, "")
                                : info.value;
                              handleCopy(valueToCopy, info.title);
                            }}
                            className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                            aria-label={`Copy ${info.title}`}
                            title={`Copy ${info.title}`}
                          >
                            {copiedField === info.title ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* WhatsApp Badge */}
                      {info.title === t("info.phone.title") && (
                        <a 
                          href="https://wa.me/34674748699"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center space-x-2 rtl:space-x-reverse hover:opacity-80 transition-opacity cursor-pointer"
                          aria-label="WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {t("info.whatsapp.available")}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Section - Full width below */}
        <div className="mt-16 w-full">
          <div className="text-center">
            <h4 className="mb-4 text-center text-lg font-semibold text-foreground">
              {t("social.title")}
            </h4>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {t("social.description")}
            </p>
            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
              {socialLinks.map(({ href, icon: Icon, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground ${hoverColor} hover:scale-110 transition-all duration-200`}
                  aria-label={label}
                >
                  <Icon className="h-8 w-8" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
