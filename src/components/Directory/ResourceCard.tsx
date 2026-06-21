"use client";

import { memo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, ExternalLink, BookOpen, Clock, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { DirectoryResource } from '@/data/directory';

interface ResourceCardProps {
  resource: DirectoryResource;
  existingBlogSlugs?: string[];
}

function ResourceCard({ resource, existingBlogSlugs = [] }: ResourceCardProps) {
  const t = useTranslations('directory');

  const isBlogGuide = !!resource.blogSlug;
  const blogArticleExists = isBlogGuide && existingBlogSlugs.includes(resource.blogSlug!);

  const coverImage = blogArticleExists && resource.blogSlug
    ? `/images/blog/${resource.blogSlug}/cover.webp`
    : null;

  return (
    <div className={cn(
      "group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden",
      "shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300",
      "text-left rtl:text-right h-full"
    )}>
      {coverImage && (
        <Link href={`/article/${resource.blogSlug}`} className="group/cover relative w-full h-44 shrink-0 block overflow-hidden">
          <Image
            src={coverImage}
            alt={t(`resources.${resource.id}.name`)}
            fill
            className="object-cover transition-transform duration-300 group-hover/cover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto -mt-6 -mr-6 rtl:-ml-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-xl font-bold text-foreground line-clamp-2">
              {t(`resources.${resource.id}.name`)}
            </h3>
            {isBlogGuide && !blogArticleExists && (
              <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                <Clock className="h-3 w-3" />
                {t('comingSoon')}
              </span>
            )}
          </div>
          {t.has(`resources.${resource.id}.description`) && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {t(`resources.${resource.id}.description`)}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          {resource.city && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{resource.city}</span>
              {resource.address && <span className="hidden sm:inline">({resource.address})</span>}
            </div>
          )}

          {resource.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${resource.phone.replace(/\s+/g, '')}`} className="hover:text-primary hover:underline" dir="ltr">
                {resource.phone}
              </a>
            </div>
          )}

          {resource.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${resource.email}`} className="hover:text-primary hover:underline line-clamp-1">
                {resource.email}
              </a>
            </div>
          )}

          {resource.url && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4 shrink-0" />
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline line-clamp-1" dir="ltr">
                {resource.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/+$/, '')}
              </a>
            </div>
          )}

          {resource.facebook && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Facebook className="h-4 w-4 shrink-0" />
              <a href={resource.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline line-clamp-1">
                Facebook
              </a>
            </div>
          )}

          {resource.linkedin && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Linkedin className="h-4 w-4 shrink-0" />
              <a href={resource.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline line-clamp-1">
                LinkedIn
              </a>
            </div>
          )}
        </div>

        {isBlogGuide && (
          <div className="mt-auto pt-4">
            {blogArticleExists ? (
              <Button asChild className="w-full justify-center">
                <Link href={`/article/${resource.blogSlug}`}>
                  <BookOpen className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                  <span>{t('readGuide')}</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-full justify-center opacity-50 cursor-not-allowed">
                <BookOpen className="h-4 w-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                <span>{t('guideComingSoon')}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ResourceCard);
