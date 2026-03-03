'use client';

import dynamic from 'next/dynamic';

const SpainConsularMap = dynamic(
  () => import('@/components/Directory/SpainConsularMap'),
  {
    ssr: false,
    loading: () => (
      <div className="my-8 h-[500px] animate-pulse rounded-lg bg-muted" />
    ),
  }
);

export default function BlogConsularMap() {
  return (
    <div className="not-prose my-10">
      <SpainConsularMap />
    </div>
  );
}
