import { Home, Users, BookOpen, DollarSign, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-blue-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Saint Mary Church</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:text-yellow-400 flex items-center gap-2"><Home size={18}/> Dashboard</Link>
        <Link to="/committee" className="hover:text-yellow-400 flex items-center gap-2"><Users size={18}/> Committee</Link>
        <Link to="/members" className="hover:text-yellow-400 flex items-center gap-2"><Users size={18}/> Members</Link>
        <Link to="/education" className="hover:text-yellow-400 flex items-center gap-2"><BookOpen size={18}/> Education</Link>
        <Link to="/finance" className="hover:text-yellow-400 flex items-center gap-2"><DollarSign size={18}/> Finance</Link>
        <Link to="/settings" className="hover:text-yellow-400 flex items-center gap-2"><Settings size={18}/> Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
