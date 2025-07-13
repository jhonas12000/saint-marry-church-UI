import React from "react";
import { useNavigate } from "react-router-dom"; 

// Updated Member type
type Member = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string; 
  phone: string; 
  email: string;
  address?: string;
  monthlyPayment?: string; // This field already exists
  totalPaidThisYear?: number; 
  monthsPaidThisYear?: string[];
};

// Enhanced mock data (keep this for UI development)
const mockMembers: Member[] = [
  { 
    id: 1, 
    firstName: "Yonas", 
    lastName: "Weldemichael", 
    fullName: "Yonas Weldemichael", 
    phone: "(510) 123-4567", 
    email: "yonas@example.com", 
    address: "Oakland, CA", 
    monthlyPayment: "$50", // Ensure monthlyPayment is present in mock data
    totalPaidThisYear: 350, 
    monthsPaidThisYear: ["January", "February", "March", "April", "May", "June", "July"]
  },
  { 
    id: 2, 
    firstName: "Ruth", 
    lastName: "Abraham", 
    fullName: "Ruth Abraham", 
    phone: "(408) 765-4321", 
    email: "ruth@example.com", 
    address: "San Jose, CA", 
    monthlyPayment: "$40", // Ensure monthlyPayment is present in mock data
    totalPaidThisYear: 120, 
    monthsPaidThisYear: ["January", "February", "March"]
  },
  { 
    id: 3, 
    firstName: "Michael", 
    lastName: "Solomon", 
    fullName: "Michael Solomon", 
    phone: "(650) 987-6543", 
    email: "michael@example.com", 
    address: "San Francisco, CA", 
    monthlyPayment: "$60", // Ensure monthlyPayment is present in mock data
    totalPaidThisYear: 0,
    monthsPaidThisYear: []
  },
];

const MembersTableView: React.FC = () => {
  const navigate = useNavigate();
  const members = mockMembers; 

  const sortedMembers = [...members].sort((a, b) => {
    const nameA = a.fullName.toLowerCase();
    const nameB = b.fullName.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const getMonthsPaidRange = (months: string[] | undefined) => {
    if (!months || months.length === 0) return "None";
    if (months.length === 1) return months[0];
    
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const sorted = [...months].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  };

  const handleViewProfile = (id: number) => {
    navigate(`/members/${id}`);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* REMOVED: h1 title for this specific view - the main title is in Members.tsx */}
      {/* REMOVED: Navigation buttons - these belong ONLY in Members.tsx */}

      {members.length === 0 ? (
        <p className="text-gray-600">No members found in mock data.</p>
      ) : (
        <table className="min-w-full border mt-4 bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">First Name</th>
              <th className="p-2 border text-left">Last Name</th>
              <th className="p-2 border text-left">Phone</th>
              <th className="p-2 border text-left">email</th>
              {/* --- NEW: Monthly Payment Column Header --- */}
              <th className="p-2 border text-left">Monthly Payment</th> 
              {/* --- END NEW --- */}
              <th className="p-2 border text-left">Total Paid (This Year)</th>
              <th className="p-2 border text-left">Months Paid</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member) => (
              <tr key={member.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleViewProfile(member.id)}>
                <td className="p-2 border">{member.firstName}</td>
                <td className="p-2 border">{member.lastName}</td>
                <td className="p-2 border">{member.phone}</td>
                <td className="p-2 border">{member.email}</td>
                {/* --- NEW: Monthly Payment Data Cell --- */}
                <td className="p-2 border">{member.monthlyPayment || '$0'}</td>
                {/* --- END NEW --- */}
                <td className="p-2 border">${member.totalPaidThisYear || 0}</td>
                <td className="p-2 border">{getMonthsPaidRange(member.monthsPaidThisYear)}</td>
                <td className="p-2 border text-blue-600 underline">View Profile</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MembersTableView;