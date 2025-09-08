
// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// type Member = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   telephone: string;
//   address?: string;
//   monthlyPayment?: number;
//   medhaneAlemPledge?: number;
//   memberSince: string;
//   totalPaidThisYear?: number;
//   monthsPaidThisYear?: number;
// };

// interface MembersTableViewProps {
//   members: Member[];
//   refreshMembers: () => void;
// }

// const calculateMemberDuration = (registeredDate?: string): string => {
//   if (!registeredDate) return "—";

//   const reg = new Date(registeredDate);
//   if (isNaN(reg.getTime())) return "—";

//   const today = new Date();
//   let diffMonths = (today.getFullYear() - reg.getFullYear()) * 12;
//   diffMonths += today.getMonth() - reg.getMonth();

//   if (diffMonths >= 24) return "2 years or more";
//   if (diffMonths < 6) return "<6 Months";

//   return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
// };

// const MembersTableView: React.FC<MembersTableViewProps> = ({ members, refreshMembers }) => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredSortedMembers = useMemo(() => {
//     const sorted = [...members].sort(
//       (a, b) =>
//         a.firstName.localeCompare(b.firstName) ||
//         a.lastName.localeCompare(b.lastName)
//     );

//     if (!searchQuery.trim()) return sorted;

//     const query = searchQuery.toLowerCase();
//     return sorted.filter(
//       (m) =>
//         `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
//         m.telephone.includes(query)
//     );
//   }, [members, searchQuery]);




//   const handleViewProfile = (id: number) => {
//     navigate(`/members/${id}`);
//   };

//   const getMonthsPaidRange = (monthsCount: number | undefined) => {
//     if (!monthsCount || monthsCount <= 0) return "None";
//     return `${monthsCount} month${monthsCount > 1 ? "s" : ""}`;
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Members</h2>
//         <input
//           type="text"
//           placeholder="Search by name or phone"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border px-3 py-1 rounded"
//         />
//       </div>

//       {filteredSortedMembers.length === 0 ? (
//         <p className="text-gray-600">No matching members found.</p>
//       ) : (
//         <table className="min-w-full border mt-4 bg-white rounded shadow">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border text-left">First Name</th>
//               <th className="p-2 border text-left">Last Name</th>
//               <th className="p-2 border text-left">Phone</th>
//               {/* <th className="p-2 border text-left">Email</th> */}
//               <th className="p-2 border text-left">Monthly Payment</th>
//               <th className="p-2 border text-left">Medhane Alem</th>
//               <th className="p-2 border text-left">Member Since</th>
//               {/* <th className="p-2 border text-left">Member Duration</th> */}
//               <th className="p-2 border text-left">Total Paid (This Year)</th>
//               <th className="p-2 border text-left">Months Paid</th>
//               <th className="p-2 border text-left"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSortedMembers.map((member) => (
//               <tr
//                 key={member.id}
//                 className="border-t hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleViewProfile(member.id)}
//               >
//                 <td className="p-2 border">{member.firstName}</td>
//                 <td className="p-2 border">{member.lastName}</td>
//                 <td className="p-2 border">{member.telephone}</td>
//                 {/* <td className="p-2 border">{member.email}</td> */}
//                 <td className="p-2 border">${member.monthlyPayment ?? 0}</td>
//                 <td className="p-2 border">${member.medhaneAlemPledge ?? 0}</td>
//                 <td className="p-2 border">
//                   {member.memberSince && !isNaN(new Date(member.memberSince).getTime())
//                     ? new Date(member.memberSince).toLocaleDateString()
//                     : "—"}
//                 </td>
//                 {/* <td className="p-2 border">{calculateMemberDuration(member.memberSince)}</td> */}
//                 <td className="p-2 border">${member.totalPaidThisYear ?? 0}</td>
//                 <td className="p-2 border">{getMonthsPaidRange(member.monthsPaidThisYear)}</td>
//                 <td className="p-2 border text-blue-600 underline">View Profile</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default MembersTableView;

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address?: string;
  monthlyPayment?: number;
  medhaneAlemPledge?: number;
  memberSince: string;
  totalPaidThisYear?: number;
  monthsPaidThisYear?: number;
};

interface MembersTableViewProps {
  members: Member[];
  refreshMembers: () => void;
}

const calculateMemberDuration = (registeredDate?: string): string => {
  if (!registeredDate) return "—";
  const reg = new Date(registeredDate);
  if (isNaN(reg.getTime())) return "—";
  const today = new Date();
  let diffMonths = (today.getFullYear() - reg.getFullYear()) * 12;
  diffMonths += today.getMonth() - reg.getMonth();
  if (diffMonths >= 24) return "2 years or more";
  if (diffMonths < 6) return "<6 Months";
  return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
};

const MembersTableView: React.FC<MembersTableViewProps> = ({ members, refreshMembers }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSortedMembers = useMemo(() => {
    const sorted = [...members].sort(
      (a, b) =>
        a.firstName.localeCompare(b.firstName) ||
        a.lastName.localeCompare(b.lastName)
    );
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase();
    return sorted.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
        m.telephone.includes(query)
    );
  }, [members, searchQuery]);

  const handleViewProfile = (id: number) => {
    navigate(`/members/${id}`);
  };

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
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              {filteredSortedMembers.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => handleViewProfile(member.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2">{member.firstName}</td>
                  <td className="px-4 py-2">{member.lastName}</td>
                  <td className="px-4 py-2">{member.telephone}</td>
                  <td className="px-4 py-2">${member.monthlyPayment?.toFixed(2) ?? "0.00"}</td>
                  <td className="px-4 py-2">${member.medhaneAlemPledge?.toFixed(2) ?? "0.00"}</td>
                  <td className="px-4 py-2">
                    {member.memberSince && !isNaN(new Date(member.memberSince).getTime())
                      ? new Date(member.memberSince).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">${member.totalPaidThisYear?.toFixed(2) ?? "0.00"}</td>
                  <td className="px-4 py-2">{getMonthsPaidRange(member.monthsPaidThisYear)}</td>
                  <td className="px-4 py-2 text-indigo-600 font-medium hover:underline">
                    View
                  </td>
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
