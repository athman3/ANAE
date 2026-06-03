import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { BlogPostSummary } from '@/lib/blog/types';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPostSummary;
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const isRTL = locale === 'ar';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      {/* Image Section - Top */}
      {post.image && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={192}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      {/* Content Section - Bottom */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex flex-col gap-3 flex-grow">
          {/* Tags */}
          <div className={cn('flex flex-wrap gap-2', isRTL && 'flex-row-reverse')}>
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Title */}
          <CardTitle className="text-xl line-clamp-2">
            <Link 
              href={`/article/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </CardTitle>
          
          {/* Description */}
          <CardDescription className="line-clamp-3 flex-grow">
            {post.description}
          </CardDescription>
          
          {/* Meta Information */}
          <div className={cn(
            'flex flex-wrap gap-3 text-xs text-muted-foreground pt-3 border-t',
            isRTL && 'flex-row-reverse'
          )}>
            <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime} min</span>
            </div>
            <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
              <User className="h-3.5 w-3.5" />
              <span>{post.author}</span>
            </div>
          </div>
          
          {/* Read More Link */}
          <div className="mt-2">
            <Link 
              href={`/article/${post.slug}`}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline',
                isRTL && 'flex-row-reverse'
              )}
            >
              {locale === 'es' && 'Leer más →'}
              {locale === 'fr' && 'Lire la suite →'}
              {locale === 'en' && 'Read more →'}
              {locale === 'ar' && 'اقرأ المزيد ←'}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
