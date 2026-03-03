"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { REGIONS, BALEARES_PATH, type ConsularZone } from '@/data/spainMapData';

const ZONE_COLORS: Record<ConsularZone, { fill: string; hover: string; label: string }> = {
  madrid:    { fill: '#2D6A4F', hover: '#1B4332', label: '#2D6A4F' },
  barcelona: { fill: '#1E40AF', hover: '#1E3A8A', label: '#1E40AF' },
  alicante:  { fill: '#C2410C', hover: '#9A3412', label: '#C2410C' },
};

const MISSIONS = [
  {
    zone: 'madrid' as ConsularZone,
    key: 'embassy',
    url: 'http://www.emb-argelia.es',
    urlLabel: 'emb-argelia.es',
  },
  {
    zone: 'barcelona' as ConsularZone,
    key: 'barcelona',
    url: 'https://consulatalgerie-barcelone.org',
    urlLabel: 'consulatalgerie-barcelone.org',
  },
  {
    zone: 'alicante' as ConsularZone,
    key: 'alicante',
    url: 'https://www.consulalg.es/',
    urlLabel: 'consulalg.es',
  },
];

export default function SpainConsularMap() {
  const t = useTranslations('directory.consularMap');
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ pctX: number; pctY: number; regionName: string; missionLabel: string } | null>(null);

  function getRegionInfo(regionId: string, zone: ConsularZone): { regionName: string; missionLabel: string } {
    const missionLabel = zone === 'madrid'
      ? t('embassy')
      : zone === 'barcelona'
      ? t('consulateBarcelona')
      : t('consulateAlicante');
    const regionName = t(`regions.${regionId}` as Parameters<typeof t>[0]);
    return { regionName, missionLabel };
  }

  function getRegionLabel(regionId: string, zone: ConsularZone): string {
    const { regionName, missionLabel } = getRegionInfo(regionId, zone);
    return `${regionName} — ${missionLabel}`;
  }

  function handleMouseMove(e: React.MouseEvent<SVGPathElement>, regionId: string, zone: ConsularZone) {
    const container = e.currentTarget.closest('[data-map-container]') as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    const { regionName, missionLabel } = getRegionInfo(regionId, zone);
    setHoveredRegion(regionId);
    setTooltip({ pctX, pctY, regionName, missionLabel });
  }

  function handleMouseLeave() {
    setHoveredRegion(null);
    setTooltip(null);
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">

      <div className="px-5 py-4 border-b border-border/50 bg-muted/10">
        <h3 className="text-sm font-semibold text-foreground">{t('title')}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row rtl:lg:flex-row-reverse">

        <div className="flex-1 p-3 sm:p-5">
          <div className="relative w-full" data-map-container style={{ direction: 'ltr', aspectRatio: '750/600' }}>
            <svg
              viewBox="0 0 750 600"
              className="w-full h-full"
              aria-label={t('title')}
              role="img"
            >
              {REGIONS.map(({ id, zone, d }) => {
                const colors = ZONE_COLORS[zone];
                const isHovered = hoveredRegion === id;
                return (
                  <path
                    key={id}
                    d={d}
                    fill={isHovered ? colors.hover : colors.fill}
                    stroke="white"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                    style={{
                      cursor: 'pointer',
                      transition: 'fill 0.15s ease',
                      filter: isHovered ? 'brightness(0.85)' : 'none',
                    }}
                    onMouseMove={e => handleMouseMove(e, id, zone)}
                    onMouseLeave={handleMouseLeave}
                    aria-label={getRegionLabel(id, zone)}
                  />
                );
              })}

              <path
                d={BALEARES_PATH}
                fill={hoveredRegion === 'baleares' ? ZONE_COLORS.barcelona.hover : ZONE_COLORS.barcelona.fill}
                stroke="white"
                strokeWidth="0.8"
                strokeLinejoin="round"
                style={{ cursor: 'pointer', transition: 'fill 0.15s ease', filter: hoveredRegion === 'baleares' ? 'brightness(0.85)' : 'none' }}
                onMouseMove={e => handleMouseMove(e, 'baleares', 'barcelona')}
                onMouseLeave={handleMouseLeave}
                aria-label={getRegionLabel('baleares', 'barcelona')}
              />

              <text
                x="604"
                y="555"
                fontSize="8"
                fill="#6b7280"
                textAnchor="middle"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {t('regions.baleares')}
              </text>
            </svg>

            {tooltip && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${tooltip.pctX}%`,
                  top: `${tooltip.pctY}%`,
                  transform: 'translate(-50%, -100%) translateY(-8px)',
                }}
              >
                <div
                  className="rounded-md px-3 py-2 shadow-lg whitespace-nowrap"
                  style={{
                    background: 'rgba(15,23,42,0.92)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    direction: isRTL ? 'rtl' : 'ltr',
                  }}
                >
                  <p className="text-sm font-semibold text-white leading-tight">
                    {tooltip.regionName}
                  </p>
                  <p className="text-xs text-white/75 leading-tight mt-0.5">
                    {tooltip.missionLabel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-64 shrink-0 flex flex-col justify-center gap-3 px-5 pb-5 pt-0 lg:pt-5 lg:border-l rtl:lg:border-l-0 rtl:lg:border-r border-border/40">
          {MISSIONS.map(({ zone, key, url, urlLabel }) => {
            const colors = ZONE_COLORS[zone];
            return (
              <div key={zone} className="flex flex-col gap-1">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 shrink-0 h-3 w-3 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: colors.fill }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-foreground leading-tight">
                      {t(`mission.${key}.name`)}
                    </span>
                    <span className="text-[13px] text-muted-foreground leading-snug mt-0.5">
                      {t(`mission.${key}.regions`)}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[13px] hover:underline transition-colors"
                      style={{ color: colors.fill }}
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {urlLabel}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          <p className="mt-1 text-[12px] text-muted-foreground/70 italic border-t border-border/30 pt-3">
            {t('canariasNote')}
          </p>
        </div>
      </div>
    </div>
  );
}
