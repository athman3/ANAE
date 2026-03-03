import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Custom MDX components with Tailwind styling and RTL support
 * These components will be used globally across all MDX files
 */
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    // Headings with semantic styling and proper spacing
    h1: ({ children, className, ...props }) => (
      <h1
        className={cn(
          'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
          'mt-8 first:mt-0 mb-4',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }) => (
      <h2
        className={cn(
          'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
          'mt-10 first:mt-0 mb-4',
          'text-foreground border-border',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className, ...props }) => (
      <h3
        className={cn(
          'scroll-m-20 text-2xl font-semibold tracking-tight',
          'mt-8 first:mt-0 mb-4',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, className, ...props }) => (
      <h4
        className={cn(
          'scroll-m-20 text-xl font-semibold tracking-tight',
          'mt-6 first:mt-0 mb-3',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, className, ...props }) => (
      <h5
        className={cn(
          'scroll-m-20 text-lg font-semibold tracking-tight',
          'mt-6 first:mt-0 mb-3',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, className, ...props }) => (
      <h6
        className={cn(
          'scroll-m-20 text-base font-semibold tracking-tight',
          'mt-6 first:mt-0 mb-3',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </h6>
    ),

    // Paragraph with proper spacing
    p: ({ children, className, ...props }) => (
      <p
        className={cn(
          'leading-7 [&:not(:first-child)]:mt-6',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </p>
    ),

    // Lists with proper styling and RTL support
    ul: ({ children, className, ...props }) => (
      <ul
        className={cn(
          'my-6 ms-6 list-disc [&>li]:mt-2',
          'marker:text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, className, ...props }) => (
      <ol
        className={cn(
          'my-6 ms-6 list-decimal [&>li]:mt-2',
          'marker:text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, className, ...props }) => (
      <li className={cn('text-foreground', className)} {...props}>
        {children}
      </li>
    ),

    // Blockquote with custom styling
    blockquote: ({ children, className, ...props }) => (
      <blockquote
        className={cn(
          'mt-6 border-s-4 border-primary ps-6 italic',
          'text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code blocks with syntax highlighting support
    pre: ({ children, className, ...props }) => (
      <pre
        className={cn(
          'mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4',
          'text-sm',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, className, ...props }) => (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
          'text-foreground',
          className
        )}
        {...props}
      >
        {children}
      </code>
    ),

    // Links with hover effects
    a: ({ children, className, href, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'font-medium underline underline-offset-4',
          'text-primary hover:text-primary/80',
          'transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </a>
    ),

    // Horizontal rule
    hr: ({ className, ...props }) => (
      <hr
        className={cn(
          'my-8 border-border',
          className
        )}
        {...props}
      />
    ),

    // Tables with responsive styling
    table: ({ children, className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table
          className={cn(
            'w-full border-collapse',
            'text-sm',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, className, ...props }) => (
      <thead
        className={cn(
          'border-b border-border',
          className
        )}
        {...props}
      >
        {children}
      </thead>
    ),
    tbody: ({ children, className, ...props }) => (
      <tbody
        className={cn(
          '[&_tr:last-child]:border-0',
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    ),
    tr: ({ children, className, ...props }) => (
      <tr
        className={cn(
          'border-b border-border transition-colors',
          'hover:bg-muted/50',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    ),
    th: ({ children, className, ...props }) => (
      <th
        className={cn(
          'h-12 px-4 text-start align-middle font-semibold',
          'text-foreground',
          '[&:has([role=checkbox])]:pe-0',
          className
        )}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, className, ...props }) => (
      <td
        className={cn(
          'p-4 align-middle',
          'text-foreground',
          '[&:has([role=checkbox])]:pe-0',
          className
        )}
        {...props}
      >
        {children}
      </td>
    ),

    // Optimized images
    img: ({ alt = '', ...props }) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg my-6"
        {...(props as ImageProps)}
        alt={alt}
      />
    ),

    // Allow custom components to be passed in
    ...components,
  };
}
