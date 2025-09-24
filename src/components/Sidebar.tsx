import React from "react";
import {
  Home, Users, BookOpen, DollarSign, Settings, LinkIcon, Utensils, X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import SignOutButton from "../auth/SignOutButton";

type SidebarProps = {
  open: boolean;       // mobile drawer open?
  onClose: () => void; // close handler (overlay or X)
};

const navLinkBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const navLinkActive = "bg-white/10";
const navLinkIdle = "hover:bg-white/10";

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const NavItem = ({
    to,
    label,
    Icon,
    end,
  }: {
    to: string;
    label: string;
    Icon: React.ComponentType<any>;
    end?: boolean;
  }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`
      }
      onClick={onClose} // auto-close on mobile when navigating
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container
         - Mobile: fixed drawer that slides in/out
         - Desktop: NON-fixed (relative/sticky), occupies layout width
      */}
      <aside
        id="app-sidebar"
        className={[
          // mobile drawer base
          "fixed inset-y-0 left-0 z-50 h-screen w-72 transform bg-blue-900 text-white shadow-xl transition-transform duration-200 ease-out",
          // responsive desktop behavior
          "md:relative md:z-10 md:h-screen md:w-64 md:translate-x-0 md:border-r md:border-blue-800 md:shadow-none md:sticky md:top-0",
          // slide state
          open ? "translate-x-0" : "-translate-x-full",
          // on desktop, always visible (no slide)
          "md:translate-x-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <h1 className="text-lg font-semibold">Saint Mary Church</h1>
          {/* Close button: mobile only */}
          <button
            className="p-2 rounded-md hover:bg-white/10 md:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItem to="/" label="Dashboard" Icon={Home} end />
          <NavItem to="/committee" label="Committee" Icon={Users} />
          <NavItem to="/members" label="Members" Icon={Users} />
          <NavItem to="/education" label="Education" Icon={BookOpen} />
          <NavItem to="/finance" label="Finance" Icon={DollarSign} />
          <NavItem to="/settings" label="Settings" Icon={Settings} />
          <NavItem to="/pizza-family" label="Pizza Family" Icon={Utensils} />
          <NavItem to="/admin/invites" label="Invite" Icon={LinkIcon} />
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <SignOutButton className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition" />
          <div className="text-xs text-white/70 mt-2 text-center">
            Signed in • <span className="italic">secure</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
