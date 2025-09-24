// src/layout/AppShell.tsx
import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AppShell: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  // lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Your existing Sidebar (desktop rail + mobile drawer) */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Main area */}
      <div className="flex-1 min-w-0 md:ml-64">
        {/* Top bar with hamburger (visible on ALL sizes) */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="h-16 px-3 md:px-6 flex items-center justify-between">
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold">{title ?? "Saint Mary Church"}</span>
            <span className="w-9" /> {/* spacer to balance layout */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
