'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Settings, Users, Mail, Menu, FileJson, QrCode } from "lucide-react";
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    /* { icon: <Home className="w-4 h-4 mr-2" />, label: '홈', href: '/' }, */
    { icon: <FileJson className="w-4 h-4 mr-2" />, label: 'JSON 에디터', href: '/json-editor' },
    { icon: <QrCode className="w-4 h-4 mr-2" />, label: 'QR 코드 생성기', href: '/qr-generator' },
    /* { icon: <Users className="w-4 h-4 mr-2" />, label: '사용자', href: '/users' },
    { icon: <Mail className="w-4 h-4 mr-2" />, label: '메시지', href: '/messages' },
    { icon: <Settings className="w-4 h-4 mr-2" />, label: '설정', href: '/settings' }, */
  ];

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-2 z-50"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* 사이드바 */}
      <div
        data-sidebar
        className={`
          fixed lg:static h-screen bg-background border-r shadow-sm transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'w-64' : 'lg:w-0 w-64 -translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`
          p-6 pt-20 overflow-hidden
          ${isOpen ? 'opacity-100' : 'lg:opacity-0'}
          transition-opacity duration-300
        `}>
          <h2 className="text-2xl font-semibold tracking-tight">Utility</h2>
          <Separator className="my-4" />
          <nav>
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start whitespace-nowrap"
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* 오버레이 (모바일에서만) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}