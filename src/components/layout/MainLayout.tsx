'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { RightSidebar } from './RightSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8 flex gap-6">
        <main className="flex-1">
          <div className="glass-effect p-8 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
        <aside className="w-80 shrink-0">
          <div className="sticky top-24">
            <RightSidebar />
            <div className="glass-effect mt-6 p-6">
              <h3 className="section-title text-lg mb-4">联系方式</h3>
              <div className="space-y-2 text-sm text-secondary">
                <p>邮箱：zh4men9@163.com</p>
                <p>微信：zh4men9</p>
                <p className="text-xs mt-4 text-text-secondary">
                  欢迎咨询更多算命相关问题
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <footer className="text-center py-6 text-text-secondary text-sm">
        <p>© 2024 玄机(XuanJi) - AI算命系统</p>
        <p className="mt-1">由 zh4men9 开发和维护</p>
      </footer>
    </div>
  );
} 