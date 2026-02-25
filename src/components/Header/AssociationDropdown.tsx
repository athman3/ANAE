'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getNavLinkClasses } from '@/lib/utils/navigationStyles';
import { useIsHomePage } from '@/lib/hooks/useIsHomePage';
import { useState, useEffect } from 'react';

interface AssociationDropdownProps {
  is404?: boolean;
}

export function AssociationDropdown({ is404 = false }: AssociationDropdownProps) {
  const t = useTranslations('nav.association');
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = useIsHomePage(is404);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const styleOptions = { is404, isHomePage, scrolled };
  const navLinkClasses = getNavLinkClasses(styleOptions);

  const menuItems = [
    { 
      href: '/about', 
      label: t('about'),
    },
    { 
      href: '/about/gallery', 
      label: t('gallery'),
    },
    {
      href: '/support-us',
      label: t('supportUs'),
    }
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger 
        className={cn(
          "text-lg font-medium px-4 py-2 transition-all duration-300 hover:scale-[1.03]",
          "inline-flex items-center gap-1",
          "outline-none focus:outline-none focus-visible:outline-none",
          "ring-0 focus:ring-0 focus-visible:ring-0",
          navLinkClasses
        )}
      >
        {t('title')}
        <ChevronDown 
          className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" 
          aria-hidden="true" 
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-[80] min-w-[180px] overflow-hidden rounded-md border bg-white shadow-lg mt-2",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          sideOffset={8}
          align="center"
        >
          {menuItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-3 text-lg font-medium",
                  "text-gray-800 hover:text-black hover:bg-gray-50",
                  "transition-colors duration-200",
                  "cursor-pointer outline-none",
                  "first:rounded-t-md last:rounded-b-md"
                )}
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
