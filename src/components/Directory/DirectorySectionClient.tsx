"use client";

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type DirectorySection from './DirectorySection';

const DirectorySectionDynamic = dynamic(
  () => import('./DirectorySection'),
  { ssr: false }
);

export default function DirectorySectionClient(
  props: ComponentProps<typeof DirectorySection>
) {
  return <DirectorySectionDynamic {...props} />;
}
