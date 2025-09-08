import { Home, Users, BookOpen, DollarSign, Settings, LinkIcon, Utensils, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import SignOutButton from "../auth/SignOutButton"; // <-- adjust path if your Sidebar lives elsewhere

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-blue-900 text-white p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Saint Mary Church</h1>

      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:text-yellow-400 flex items-center gap-2">
          <Home size={18} /> Dashboard
        </Link>
        <Link to="/committee" className="hover:text-yellow-400 flex items-center gap-2">
          <Users size={18} /> Committee
        </Link>
        <Link to="/members" className="hover:text-yellow-400 flex items-center gap-2">
          <Users size={18} /> Members
        </Link>
        <Link to="/education" className="hover:text-yellow-400 flex items-center gap-2">
          <BookOpen size={18} /> Education
        </Link>
        <Link to="/finance" className="hover:text-yellow-400 flex items-center gap-2">
          <DollarSign size={18} /> Finance
        </Link>
        <Link to="/settings" className="hover:text-yellow-400 flex items-center gap-2">
          <Settings size={18} /> Settings
        </Link>
        <Link to="/pizza-family" className="hover:text-yellow-400 flex items-center gap-2">
          <Utensils size={18} /> Pizza Family
        </Link>
        <Link to="/admin/invites" className="hover:text-yellow-400 flex items-center gap-2">
          <LinkIcon size={18} /> Invite
        </Link>
        
      </nav>


      {/* Spacer pushes the footer to the bottom */}
      <div className="flex-1" />

      {/* Footer: Sign out button */}
      <div className="pt-4 border-t border-white/20">
        <SignOutButton className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
          {/* If you ever want to render children content inside the button, you can tweak the component; for now the default label is fine */}
        </SignOutButton>
        <div className="text-xs text-white/70 mt-2 text-center">
          Signed in • <span className="italic">secure</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


