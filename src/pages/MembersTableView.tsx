// src/pages/MembersTableView.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Member as BaseMember } from "../auth/types"; // <-- use your shared type

// Extend the shared type with optional stats used by the table
type MemberRow = BaseMember & {
  memberSince?: string;
  totalPaidThisYear?: number;
  monthsPaidThisYear?: number;
};

type Props = {
  members: MemberRow[];
  refreshMembers: () => void;
};

const MembersTableView: React.FC<Props> = ({ members /*, refreshMembers */ }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSortedMembers = useMemo(() => {
    const sorted = [...members].sort((a, b) => {
      const byFirst = (a.firstName || "").localeCompare(b.firstName || "", undefined, { sensitivity: "base" });
      if (byFirst !== 0) return byFirst;
      return (a.lastName || "").localeCompare(b.lastName || "", undefined, { sensitivity: "base" });
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return sorted;

    return sorted.filter((m) => {
      const full = `${m.firstName ?? ""} ${m.lastName ?? ""}`.toLowerCase();
      const phone = String(m.telephone ?? "").toLowerCase();
      const email = String(m.email ?? "").toLowerCase();
      return full.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [members, searchQuery]);

  const handleViewProfile = (id: number) => navigate(`/members/${id}`);

  const getMonthsPaidRange = (monthsCount: number | undefined) => {
    if (!monthsCount || monthsCount <= 0) return "None";
    return `${monthsCount} month${monthsCount > 1 ? "s" : ""}`;
    };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white rounded-2xl shadow space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Church Members</h2>
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-72 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredSortedMembers.length === 0 ? (
        <p className="text-gray-600 text-center mt-4">No matching members found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Monthly Payment</th>
                <th className="px-4 py-2 text-left">Medhane Alem</th>
                <th className="px-4 py-2 text-left">Member Since</th>
                <th className="px-4 py-2 text-left">Total Paid</th>
                <th className="px-4 py-2 text-left">Months Paid</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredSortedMembers.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => handleViewProfile(m.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2">{m.firstName}</td>
                  <td className="px-4 py-2">{m.lastName}</td>
                  <td className="px-4 py-2">{m.telephone}</td>
                  <td className="px-4 py-2">
                    ${typeof m.monthlyPayment === "number" ? m.monthlyPayment.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2">
                    ${typeof m.medhaneAlemPledge === "number" ? m.medhaneAlemPledge.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2">
                    {m.memberSince && !isNaN(new Date(m.memberSince).getTime())
                      ? new Date(m.memberSince).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    ${typeof m.totalPaidThisYear === "number" ? m.totalPaidThisYear.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-4 py-2">{getMonthsPaidRange(m.monthsPaidThisYear)}</td>
                  <td className="px-4 py-2 text-indigo-600 font-medium hover:underline">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersTableView;
