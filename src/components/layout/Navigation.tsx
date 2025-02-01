'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/' },
  { name: '算命', href: '/divination' },
  { name: '历史记录', href: '/history' },
  { name: '关于', href: '/about' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="玄机"
                className="h-8 w-8"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold">玄机</span>
            </Link>
            <div className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:zh4men9@163.com"
              className="text-sm text-text-secondary hover:text-text transition-colors"
            >
              联系我们
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 