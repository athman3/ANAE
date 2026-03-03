import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs } from '@/lib/blog/mdx';
import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, RefreshCw, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import Image from 'next/image';
import ReadingProgressBar from '@/components/Blog/ReadingProgressBar';
import BlogConsularMap from '@/components/Blog/BlogConsularMap';
import { generateArticleJsonLd, generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ 
    locale: string;
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const locales = ['es', 'fr', 'en', 'ar'];
  const params = [];

  for (const locale of locales) {
    const slugs = await getAllSlugs(locale);
    for (const slug of slugs) {
      // Encode slug for URL (especially important for Arabic characters)
      const encodedSlug = encodeURIComponent(slug);
      params.push({ locale, slug: encodedSlug });
    }
  }

  return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { locale, slug: rawSlug } = await params;
  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'ANAE - Post Not Found',
    };
  }

  return generateSEOMetadata({
    locale: locale as Locale,
    title: `ANAE - ${post.title}`,
    description: post.description,
    keywords: post.tags ? post.tags.join(', ') : undefined,
    path: `/blog/${encodeURIComponent(slug)}`,
    image: post.image || '/og',
    imageAlt: post.title,
    type: 'article',
    author: post.author,
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug: rawSlug } = await params;
  // Decode the slug to handle Arabic characters properly
  // Try to decode, but fallback to raw slug if it fails (already decoded)
  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    slug = rawSlug;
  }
  const post = await getPostBySlug(slug, locale);
  const t = await getTranslations('blog');
  const isRTL = locale === 'ar';

  if (!post || post.draft) {
    notFound();
  }

  // Generate JSON-LD for the article
  const articleJsonLd = generateArticleJsonLd({
    locale: locale as Locale,
    title: post.title,
    description: post.description,
    author: post.author,
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
    image: post.image,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://asociacionanae.org'}/${locale}/blog/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="min-h-screen pt-24 md:pt-28">
        <ReadingProgressBar />
      {/* Article Header */}
      <article className="py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Featured Image */}
          {post.image && (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          {/* Title and metadata */}
          <header className="mb-8 space-y-4">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className={cn(
                'flex flex-wrap gap-2',
                isRTL && 'flex-row-reverse'
              )}>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground">
              {post.description}
            </p>

            {/* Metadata */}
            <div className={cn(
              'flex flex-wrap gap-6 text-sm text-muted-foreground pt-4 border-t border-border',
              isRTL && 'flex-row-reverse'
            )}>
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              {post.updatedAt && (
                <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    {t('updatedAt')}{' '}
                    <time dateTime={post.updatedAt}>
                      {new Date(post.updatedAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </span>
                </div>
              )}
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} {t('minRead')}</span>
              </div>
            </div>
          </header>

          {/* Article Content with MDX */}
          <div 
            className={cn(
              'prose prose-lg dark:prose-invert max-w-none',
              'prose-headings:scroll-mt-20',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              isRTL && 'prose-rtl'
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <MDXRemote
              source={post.content}
              components={{ BlogConsularMap }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
                  ],
                },
              }}
            />
          </div>
        </div>
      </article>
    </main>
    </>
  );
}
