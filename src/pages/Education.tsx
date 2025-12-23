import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Users2, GraduationCap, BookOpen, BookUp2 } from "lucide-react";

const links = [
  { to: "/education/teachers", label: "Teachers List", icon: Users2 },
  { to: "/education/students", label: "Students List", icon: GraduationCap },
  { to: "/education/classrooms/bible", label: "Classrooms · Bible Study", icon: BookOpen },
  { to: "/education/classrooms/tigrigna", label: "Classrooms · Tigrigna", icon: BookUp2 },
];

const Education: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white shadow px-4 py-3">
        <button
          aria-label="Open menu"
          className="p-2 rounded-lg border hover:bg-gray-50"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-800">Education</h1>
        <div className="w-9" />
      </div>

      <div className="mx-auto max-w-7xl flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r bg-white shadow-lg">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-gray-800">Education</h2>
                <button
                  aria-label="Close menu"
                  className="p-2 rounded-lg border hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        {/* Content outlet */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="h-full flex flex-col">
      <div className="px-5 py-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
        <p className="text-sm text-gray-500">Navigate to a section</p>
      </div>
      <ul className="p-3 space-y-1 flex-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "hover:bg-gray-100 hover:shadow-sm",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-500"
                    : "text-gray-700",
                ].join(" ")
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-4 text-xs text-gray-400 border-t">
        Select a section to continue.
      </div>
    </nav>
  );
}

export default Education;
