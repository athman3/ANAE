"use client";

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Landmark, FileText, Scale, HeartPulse,
  GraduationCap, Briefcase, Plane, Users, Building2,
  FileCheck, HandHeart, Languages, Home, Stamp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/data/directory';
import type { DirectoryResource } from '@/data/directory';

interface CategorySidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  resources: DirectoryResource[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileCheck, HandHeart, Languages, Landmark, FileText, Scale, HeartPulse,
  GraduationCap, Briefcase, Plane, Users, Building2, Home, Stamp,
};

function CategorySidebar({ activeCategory, onSelectCategory, resources }: CategorySidebarProps) {
  const t = useTranslations('directory');

  const getCategoryCount = (categoryId: string) =>
    resources.filter(r => r.categoryId === categoryId).length;

  const allCategories = [...CATEGORIES];

  return (
    <>
      {/* Mobile / tablet: wrapping chips (hidden on lg+) */}
      <div className="lg:hidden w-full">
        <div className="flex flex-wrap gap-2">
          {allCategories.map(category => {
            const Icon = ICON_MAP[category.icon as string] ?? FileText;
            const count = getCategoryCount(category.id);
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all border',
                  isActive
                    ? 'bg-foreground text-background border-foreground font-medium'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{t(`categories.${category.id}.title`)}</span>
                {count > 0 && (
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-white/20 text-background' : 'bg-muted text-muted-foreground'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: vertical list (visible on lg+) */}
      <nav className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0">
        <ul className="space-y-1">
          {allCategories.map(category => {
            const Icon = ICON_MAP[category.icon as string] ?? FileText;
            const count = getCategoryCount(category.id);
            const isActive = activeCategory === category.id;

            return (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-md text-left rtl:text-right transition-colors text-sm',
                    isActive
                      ? 'bg-muted/80 text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3 rtl:space-x-reverse">
                    <Icon
                      className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')}
                      strokeWidth={1.5}
                    />
                    <span>{t(`categories.${category.id}.title`)}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-xs shrink-0 bg-muted/80 px-2 py-0.5 rounded-full ml-2 rtl:ml-0 rtl:mr-2">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default memo(CategorySidebar);
