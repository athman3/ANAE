import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMetadata, BlogPostSummary } from './types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

/**
 * Get all blog posts for a specific locale
 * @param locale - The locale to filter posts by (e.g., 'es', 'fr', 'en', 'ar')
 * @param includeDrafts - Whether to include draft posts (default: false)
 */
export async function getAllPosts(
  locale: string,
  includeDrafts = false
): Promise<BlogPostSummary[]> {
  // Check if blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const articleDirs = fs.readdirSync(BLOG_DIR);
  const posts: BlogPostSummary[] = [];

  for (const articleDir of articleDirs) {
    const articlePath = path.join(BLOG_DIR, articleDir);
    const stat = fs.statSync(articlePath);

    if (!stat.isDirectory()) continue;

    // Check if locale subdirectory exists
    const localePath = path.join(articlePath, locale);
    if (!fs.existsSync(localePath)) continue;

    // Look for index.mdx or index.md in the locale subdirectory
    let filePath: string | null = null;
    if (fs.existsSync(path.join(localePath, 'index.mdx'))) {
      filePath = path.join(localePath, 'index.mdx');
    } else if (fs.existsSync(path.join(localePath, 'index.md'))) {
      filePath = path.join(localePath, 'index.md');
    }

    if (!filePath) continue;

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Skip drafts if not included
    if (!includeDrafts && data.draft) continue;

    const metadata = data as BlogPostMetadata;

    posts.push({
      slug: articleDir,
      title: metadata.title,
      description: metadata.description,
      date: metadata.date,
      updatedAt: metadata.updatedAt,
      author: metadata.author,
      image: metadata.image,
      tags: metadata.tags || [],
      locale,
      readingTime: calculateReadingTime(content),
    });
  }

  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Get a single blog post by slug and locale
 */
export async function getPostBySlug(
  slug: string,
  locale: string
): Promise<BlogPost | null> {
  const articlePath = path.join(BLOG_DIR, slug);
  const localePath = path.join(articlePath, locale);

  if (!fs.existsSync(localePath)) {
    return null;
  }

  // Look for index.mdx or index.md in the locale subdirectory
  let filePath: string | null = null;
  if (fs.existsSync(path.join(localePath, 'index.mdx'))) {
    filePath = path.join(localePath, 'index.mdx');
  } else if (fs.existsSync(path.join(localePath, 'index.md'))) {
    filePath = path.join(localePath, 'index.md');
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const metadata = data as BlogPostMetadata;

  return {
    slug,
    content,
    title: metadata.title,
    description: metadata.description,
    date: metadata.date,
    updatedAt: metadata.updatedAt,
    author: metadata.author,
    image: metadata.image,
    tags: metadata.tags || [],
    draft: metadata.draft || false,
    locale,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Get all unique tags across all posts for a locale
 */
export async function getAllTags(locale: string): Promise<string[]> {
  const posts = await getAllPosts(locale);
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * Get posts by tag for a specific locale
 */
export async function getPostsByTag(
  tag: string,
  locale: string
): Promise<BlogPostSummary[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter((post) => post.tags?.includes(tag));
}

/**
 * Get all slugs for a specific locale (for static generation)
 */
export async function getAllSlugs(locale: string): Promise<string[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const articleDirs = fs.readdirSync(BLOG_DIR);
  return articleDirs.filter((articleDir) => {
    const articlePath = path.join(BLOG_DIR, articleDir);
    if (!fs.statSync(articlePath).isDirectory()) return false;
    
    const localePath = path.join(articlePath, locale);
    return fs.existsSync(localePath);
  });
}

/**
 * Get recent posts for a locale (for sidebar, homepage, etc.)
 */
export async function getRecentPosts(
  locale: string,
  limit = 5
): Promise<BlogPostSummary[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.slice(0, limit);
}
