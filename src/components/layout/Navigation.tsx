'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  User,
  Clock,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '算命大厅', href: '/', icon: Home },
  { name: '个人中心', href: '/profile', icon: User },
  { name: '历史记录', href: '/history', icon: Clock },
  { name: '设置', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-purple-800 text-white'
                        : 'text-purple-200 hover:text-white hover:bg-purple-800',
                      'group flex items-center gap-x-2 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-white'
                          : 'text-purple-200 group-hover:text-white',
                        'w-3.5 h-3.5 shrink-0'
                      )}
                      strokeWidth={1.5}
                      size={14}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  );
} 