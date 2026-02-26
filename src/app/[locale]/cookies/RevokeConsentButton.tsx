"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function RevokeConsentButton() {
    const t = useTranslations('cookies.sections.consent');
    const [isRevoked, setIsRevoked] = useState(false);
    const [isGranted, setIsGranted] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent === 'granted') {
            setIsGranted(true);
        }
    }, []);

    const handleRevoke = () => {
        // Supprimer le choix du localStorage
        localStorage.setItem('cookie_consent', 'denied');
        
        // Mettre à jour Google Consent Mode immédiatement
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: "denied",
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
            });
        }
        
        setIsRevoked(true);
        setIsGranted(false);
        
        // Optionnel: Recharger la page après 2 secondes pour être sûr de nettoyer les scripts
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    if (!isGranted && !isRevoked) {
        return null;
    }

    return (
        <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            {isRevoked ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-500">
                    {t('revokeSuccess')}
                </p>
            ) : (
                <Button 
                    onClick={handleRevoke} 
                    variant="destructive"
                    className="mt-2"
                >
                    {t('revokeButton')}
                </Button>
            )}
        </div>
    );
}
