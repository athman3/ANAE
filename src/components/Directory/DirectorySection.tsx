"use client";

import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Search, MapPin, PlusCircle, X, SlidersHorizontal } from 'lucide-react';
import { RESOURCES, CATEGORIES } from '@/data/directory';
import CategorySidebar from './CategorySidebar';
import ResourceCard from './ResourceCard';
import SpainConsularMap from './SpainConsularMap';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface DirectorySectionProps {
  existingBlogSlugs?: string[];
  searchIndex?: Record<string, string>;
  ssrContent?: ReactNode;
}

function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const ITEMS_PER_PAGE = 8;

export default function DirectorySection({ existingBlogSlugs = [], searchIndex = {}, ssrContent }: DirectorySectionProps) {
  const t = useTranslations('directory');

  const validCategoryIds = useMemo(() => CATEGORIES.map(c => c.id), []);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return CATEGORIES.map(c => c.id).includes(hash) ? hash : 'consulates';
  });
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    RESOURCES.forEach(r => {
      if (r.city) cities.add(r.city);
    });
    return Array.from(cities).sort();
  }, []);

  const filteredResources = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return RESOURCES.filter(resource => {
      const categoryMatch = activeCategory === 'all' || resource.categoryId === activeCategory;
      const cityMatch = cityFilter === 'all' || resource.city === cityFilter;
      const searchMatch = query === '' || (searchIndex[resource.id] ?? '').includes(query);
      return (query !== '' ? searchMatch && cityMatch : categoryMatch && cityMatch && searchMatch);
    });
  }, [activeCategory, cityFilter, searchQuery, searchIndex]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, cityFilter, searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }
    if (filtersOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filtersOpen]);

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeCategory}`);
  }, [activeCategory]);

  useEffect(() => {
    function handlePopState() {
      const hash = window.location.hash.replace('#', '');
      if (hash && validCategoryIds.includes(hash)) {
        setActiveCategory(hash);
        setCityFilter('all');
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [validCategoryIds]);

  const visibleResources = filteredResources.slice(0, visibleCount);
  const hasMore = visibleCount < filteredResources.length;

  function handleSearch(value: string) {
    setSearchQuery(value);
  }

  function resetAllFilters() {
    setCityFilter('all');
    setSearchQuery('');
  }

  const activeFilterCount = cityFilter !== 'all' ? 1 : 0;
  const hasActiveFilters = cityFilter !== 'all' || searchQuery !== '';

  return (
    <>
      {ssrContent && (
        <div aria-hidden hidden>
          {ssrContent}
        </div>
      )}

      <div className="flex flex-col gap-8">

      {/* ── Mobile search + filters toggle (hidden on lg+) ─────────────── */}
      <div className="lg:hidden flex flex-col gap-4">
        <div className="flex gap-2" ref={filtersRef}>
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-9 rtl:pl-9 rtl:pr-9 py-2.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                aria-label="Clear search"
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              aria-expanded={filtersOpen}
              className={[
                'flex items-center gap-1.5 px-3 py-2.5 text-sm rounded-md border transition-colors',
                filtersOpen || activeFilterCount > 0
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-input hover:border-ring',
              ].join(' ')}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t('filters.toggle')}</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 rtl:ml-0 rtl:mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-foreground text-[10px] font-semibold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filtersOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 z-50 w-64 rounded-lg border border-border bg-background shadow-lg p-4 flex flex-col gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    aria-label={t('filters.city')}
                    className="w-full pl-9 pr-8 rtl:pl-8 rtl:pr-9 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                  >
                    <option value="all">{t('filters.allCities')}</option>
                    {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setCityFilter('all'); setFiltersOpen(false); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 text-left rtl:text-right transition-colors"
                  >
                    {t('filters.reset')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile category chips */}
        <CategorySidebar
          activeCategory={activeCategory}
          onSelectCategory={cat => { setActiveCategory(cat); setCityFilter('all'); }}
          resources={RESOURCES}
        />
      </div>

      {/* ── Desktop: search + filters bar (full width, above sidebar+content) ── */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-9 rtl:pl-9 rtl:pr-9 py-2.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              aria-label="Clear search"
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            aria-label={t('filters.city')}
            className="pl-9 pr-8 rtl:pl-8 rtl:pr-9 py-2.5 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="all">{t('filters.allCities')}</option>
            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>

      {/* ── Main layout: sidebar (lg+) + content ────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* Desktop sidebar — visible on lg+ only */}
        <aside className="hidden lg:block shrink-0 border-r rtl:border-r-0 rtl:border-l border-border pr-8 rtl:pr-0 rtl:pl-8">
          <CategorySidebar
            activeCategory={activeCategory}
            onSelectCategory={cat => { setActiveCategory(cat); setCityFilter('all'); }}
            resources={RESOURCES}
          />
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Consular map — shown only when the consulates category is active */}
          {activeCategory === 'consulates' && !searchQuery && (
            <SpainConsularMap />
          )}

          {/* Resource grid / empty states */}
          {filteredResources.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {visibleResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} existingBlogSlugs={existingBlogSlugs} />
                ))}
              </div>

              <div className="flex flex-col items-center gap-3 mt-2">
                {hasMore && (
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)}
                  >
                    {t('loadMore')}
                    <span className="ml-1 rtl:ml-0 rtl:mr-1 text-muted-foreground">
                      {t('loadMoreCount', { count: filteredResources.length - visibleCount })}
                    </span>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/60 rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" strokeWidth={1} />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('noResults')}</h3>
              {hasActiveFilters && (
                <Button variant="outline" onClick={resetAllFilters} className="mt-4">
                  {t('filters.reset')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Suggest a resource CTA ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-xl border border-border/50 bg-muted/10">
        <div className="flex items-center gap-3">
          <PlusCircle className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">{t('suggestDescription')}</p>
        </div>
        <Button asChild variant="default" size="sm">
          <Link href="/contact">{t('suggestResource')}</Link>
        </Button>
      </div>

    </div>
    </>
  );
}
