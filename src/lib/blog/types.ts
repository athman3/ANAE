/**
 * Blog post metadata types
 */
export interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  image?: string;
  tags?: string[];
  draft?: boolean;
  locale?: string;
}

/**
 * Blog post with content
 */
export interface BlogPost extends BlogPostMetadata {
  slug: string;
  content: string;
  readingTime: number; // in minutes
}

/**
 * Blog post summary for listing pages
 */
export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  image?: string;
  tags?: string[];
  locale?: string;
  readingTime: number;
}
