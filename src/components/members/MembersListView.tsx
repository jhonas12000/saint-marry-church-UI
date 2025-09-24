// src/components/members/MembersListView.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { RefreshCw, Search } from "lucide-react";

type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address?: string;
  monthlyPayment?: number;
  medhaneAlemPledge?: number;
};

interface MembersListViewProps {
  members: Member[];
  refreshMembers: () => void;
}

const MembersListView: React.FC<MembersListViewProps> = ({ members, refreshMembers }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleViewProfile = (id: number) => navigate(`/members/${id}`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.delete(`/church-members/${id}`);
      alert("✅ Member deleted successfully!");
      refreshMembers();
    } catch (error) {
      console.error("Failed to delete member", error);
      alert("❌ Failed to delete member.");
    }
  };

  // Filter + ASC sort (First Name, then Last Name)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q
      ? members
      : members.filter((m) => {
          const full = `${m.firstName} ${m.lastName}`.toLowerCase();
          return (
            full.includes(q) ||
            (m.email || "").toLowerCase().includes(q) ||
            (m.telephone || "").toLowerCase().includes(q)
          );
        });

    return [...list].sort((a, b) => {
      const aFirst = (a.firstName || "").trim();
      const bFirst = (b.firstName || "").trim();
      const byFirst = aFirst.localeCompare(bFirst, undefined, { sensitivity: "base" });
      if (byFirst !== 0) return byFirst;

      const aLast = (a.lastName || "").trim();
      const bLast = (b.lastName || "").trim();
      return aLast.localeCompare(bLast, undefined, { sensitivity: "base" });
    });
  }, [members, query]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      {/* Toolbar: search + refresh */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Members</h3>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone"
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-2.5 text-xs text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={refreshMembers}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No members found{query ? ` for “${query}”` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer relative"
              onClick={() => handleViewProfile(member.id)}
            >
              <h4 className="font-semibold text-lg text-gray-800">
                {member.firstName} {member.lastName}
              </h4>

              <p className="text-gray-600 text-sm">
                <span className="font-medium">Email:</span>{" "}
                {member.email || <span className="text-gray-400">N/A</span>}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Phone:</span>{" "}
                {member.telephone || <span className="text-gray-400">N/A</span>}
              </p>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(member.id);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(member.id);
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersListView;
