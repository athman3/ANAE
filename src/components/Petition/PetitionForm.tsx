'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/navigation';
import SignaturePad, { type SignaturePadHandle } from './SignaturePad';
import { NIE_OR_DNI_FORMAT_REGEX } from '@/lib/utils/validateNie';

export default function PetitionForm() {
  const t = useTranslations('petition');
  const sigPadRef = useRef<SignaturePadHandle>(null);

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nie, setNie] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!nombre.trim()) errors.nombre = t('form.errors.required');
    if (!apellidos.trim()) errors.apellidos = t('form.errors.required');

    if (!nie.trim()) {
      errors.nie = t('form.errors.required');
    } else if (!NIE_OR_DNI_FORMAT_REGEX.test(nie.trim())) {
      errors.nie = t('form.errors.invalidNie');
    }

    if (!consentAccepted) errors.consent = t('form.errors.consentRequired');
    if (sigPadRef.current?.isEmpty()) errors.signature = t('form.errors.signatureRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [nombre, apellidos, nie, consentAccepted, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const signatureDataUrl = sigPadRef.current!.toDataURL();

        const res = await fetch('/api/petition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            nie: nie.trim().toUpperCase(),
            signatureDataUrl,
            consent: consentAccepted,
          }),
        });

        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? t('form.error'));
        }

        setIsSubmitted(true);
        setNombre('');
        setApellidos('');
        setNie('');
        setConsentAccepted(false);
        sigPadRef.current?.clear();
      } catch (err) {
        setError(err instanceof Error ? err.message : t('form.error'));
        if (process.env.NODE_ENV === 'development') {
          console.error('Petition submit error:', err);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, nombre, apellidos, nie, consentAccepted, t]
  );

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <h3 className="text-xl font-semibold text-green-800">{t('form.success.title')}</h3>
        <p className="text-green-700">{t('form.success.message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-foreground">
            {t('form.fields.nombre')} <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t('form.placeholders.nombre')}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!fieldErrors.nombre}
            className="h-12"
          />
          {fieldErrors.nombre && (
            <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.nombre}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="apellidos" className="mb-2 block text-sm font-medium text-foreground">
            {t('form.fields.apellidos')} <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <Input
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder={t('form.placeholders.apellidos')}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!fieldErrors.apellidos}
            className="h-12"
          />
          {fieldErrors.apellidos && (
            <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.apellidos}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="nie" className="mb-2 block text-sm font-medium text-foreground">
          {t('form.fields.nie')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <Input
          id="nie"
          value={nie}
          onChange={(e) => setNie(e.target.value.toUpperCase())}
          placeholder={t('form.placeholders.nie')}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!fieldErrors.nie}
          className="h-12 uppercase"
          maxLength={9}
          autoComplete="off"
        />
        {fieldErrors.nie && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.nie}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          {t('form.fields.signature')} <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <p className="mb-2 text-sm text-muted-foreground">{t('form.signatureHint')}</p>
        <SignaturePad ref={sigPadRef} disabled={isSubmitting} />
        {fieldErrors.signature && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.signature}</p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            disabled={isSubmitting}
            className="mt-1 h-4 w-4 rounded border-border accent-primary"
            aria-required="true"
            aria-invalid={!!fieldErrors.consent}
          />
          <span className="text-sm text-muted-foreground">
            {t.rich('form.consent', {
              privacy: (chunks) => (
                <Link href="/privacy" className="underline hover:text-foreground">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {fieldErrors.consent && (
          <p className="mt-1 text-sm text-red-600" role="alert">{fieldErrors.consent}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-semibold"
      >
        {isSubmitting ? t('form.sending') : t('form.submit')}
      </Button>
    </form>
  );
}
