// src/layout/Layout.tsx
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

type Props = { children: React.ReactNode; title?: string };

const Layout: React.FC<Props> = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar: drawer on mobile; in-flow (sticky) on desktop */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* ⬇️ REMOVE md:ml-64 here */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="h-16 px-3 md:px-6 flex items-center justify-between">
            <button
              className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-semibold">{title ?? "Saint Mary Church"}</span>
            <span className="w-9 md:w-0" />
          </div>
        </header>

        <main className="p-3 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
