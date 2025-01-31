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
    <div className="h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      {/* 移动端侧边栏 */}
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        open={sidebarOpen}
        onClose={setSidebarOpen}
      >
        <div className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu className="h-4 w-4 text-white" />
              </button>
            </div>
            {/* 移动端侧边栏内容 */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-purple-900 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="玄机"
                  width={32}
                  height={32}
                />
              </div>
              <Navigation />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* 静态侧边栏（桌面端） */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-purple-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="玄机"
              width={32}
              height={32}
            />
          </div>
          <Navigation />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 中间内容区域 */}
            <div className="flex">
              <div className="flex-grow">
                {children}
              </div>
              {/* 右侧边栏 */}
              <div className="hidden xl:block xl:w-80 xl:pl-8">
                <div className="sticky top-24">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 