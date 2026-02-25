import { getAllPosts } from '@/lib/blog/mdx';
import { getTranslations } from 'next-intl/server';
import { BlogCard } from '@/components/Blog/BlogCard';
import { cn } from '@/lib/utils';
import { generateMetadata as generateSEOMetadata, type Locale } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo.blog' });

  return generateSEOMetadata({
    locale: locale as Locale,
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    path: '/blog',
    image: '/og',
    imageAlt: t('imageAlt'),
    type: 'website',
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const posts = await getAllPosts(locale);
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen pt-24 md:pt-28">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid - Vertical Cards */}
      <section className="py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {posts.length === 0 ? (
            <div className={cn(
              'text-center py-12',
              isRTL && 'text-right'
            )}>
              <p className="text-muted-foreground text-lg">
                {t('noPosts')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
