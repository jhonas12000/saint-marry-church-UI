// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";


// type Member = {
//   id: number;
//   fullName: string;
//   phone: string;
  
// };

// const mockMembers: Member[] = [
//   { id: 1, fullName: "Yonas Weldemichael", phone: "(510) 123-4567" },
//   { id: 2, fullName: "Ruth Abraham", phone: "(408) 765-4321" },
//   // ... you'll replace this with fetched members later
// ];

// // Extend this list to cover all 12 months
// const allMonths = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const FinanceOfficerView: React.FC = () => {
//     const navigate = useNavigate(); 

//   const [payments, setPayments] = useState<Record<number, string[]>>({}); 
//   const [saveStatus, setSaveStatus] = useState<string | null>(null); // To show save messages

  

//   const toggleMonth = (memberId: number, month: string) => {
//     setPayments((prev) => {
//       const currentMemberPayments = prev[memberId] || []; // Get current payments for this member
//       const updatedMemberPayments = currentMemberPayments.includes(month)
//         ? currentMemberPayments.filter((m) => m !== month) // Remove month if already selected
//         : [...currentMemberPayments, month]; // Add month if not selected
      
//       // Return new state, ensuring array is sorted for consistency (optional)
//       return { ...prev, [memberId]: updatedMemberPayments.sort((a, b) => allMonths.indexOf(a) - allMonths.indexOf(b)) };
//     });
//   };

//   const handleSavePayments = async () => {
//     setSaveStatus("Saving...");
    
//     const token = null; // getJwtToken(); // Get the current user's JWT token

//     if (!token) {
//       setSaveStatus("Error: Not authenticated. Please log in.");
//       // navigate('/signin'); // Redirect to login
//       return;
//     }

//     // Prepare data to send (example structure)
//     const dataToSend = Object.entries(payments).map(([memberId, monthsPaid]) => ({
//       memberId: Number(memberId),
//       monthsPaid: monthsPaid,
//       year: new Date().getFullYear(), // Assume current year for payments
//     }));

//     console.log("Data to save:", dataToSend); // For debugging
    
//     try {
//       // ✅ TODO: Replace with your actual backend API endpoint for saving payments
//       const response = await fetch("http://localhost:8080/finance/record-payments", { 
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}` 
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       if (response.ok) {
//         setSaveStatus("Payments saved successfully!");
//         // Optionally clear payments state or refresh data after successful save
//         // setPayments({}); 
//       } else {
//         const errorText = await response.text(); // Get detailed error
//         setSaveStatus(`Error saving payments: ${response.status} - ${errorText}`);
//         console.error("Failed to save payments:", errorText);
//       }
//     } catch (err: any) {
//       setSaveStatus(`Network error: ${err.message}`);
//       console.error("Network error during save:", err);
//     }
//   };

//   return (
//     <div className="p-6"> {/* Added a main wrapper for consistency */}
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Finance Officer - Record Payments</h1>

//       {saveStatus && (
//         <div className={`mb-4 p-3 rounded ${saveStatus.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//           {saveStatus}
//         </div>
//       )}

//       {/* Render members (using mockMembers for now) */}
//       {mockMembers.length === 0 ? (
//         <p className="text-gray-600">No members to display.</p>
//       ) : (
//         <div className="space-y-6">
//           {mockMembers.map((m) => (
//             <div key={m.id} className="border p-4 rounded bg-white shadow">
//               <p><strong>Name:</strong> {m.fullName}</p>
//               <p><strong>Phone:</strong> {m.phone}</p>

//               <label className="block mt-2 font-medium text-gray-700">Select Months Paid (Current Year):</label>
//               <div className="flex flex-wrap gap-4 mt-2">
//                 {allMonths.map((month) => (
//                   <label key={month} className="flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-blue-800">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-4 w-4 text-blue-600"
//                       checked={payments[m.id]?.includes(month) || false}
//                       onChange={() => toggleMonth(m.id, month)}
//                     />
//                     {month}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <button
//         onClick={handleSavePayments}
//         className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
//       >
//         Save Payment Records
//       </button>
//       <button
//           onClick={() => navigate("/members/list")} 
//           className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-lg"
//         >
//           Back to Members List
//         </button>
//     </div>
//   );
// };

// export default FinanceOfficerView;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { format } from 'date-fns';

type Member = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
};

type Payment = {
  amount: number;
  monthPaid: string;
  paymentDate: string;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FinanceOfficerView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [month, setMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [amount, setAmount] = useState();
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<Record<number, Payment[]>>({});
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/church-members');
        const formatted = response.data.map((m: any) => ({
          id: m.id,
          fullName: `${m.firstName} ${m.lastName}`,
          phone: m.telephone,
          email: m.email
        }));
        setMembers(formatted.sort((a, b) => a.fullName.localeCompare(b.fullName)));
      } catch (error) {
        console.error('Failed to fetch members', error);
        setStatus("❌ Failed to load members");
      }
    };
    fetchMembers();
  }, []);

  const handleSubmitPayment = async (memberId: number) => {
    try {
      await axios.post('http://localhost:8080/api/payments', {
        amount,
        monthPaid: month,
        churchMember: { id: memberId }
      });
      setStatus(`✅ Payment recorded for member ${memberId}`);
      if (paymentHistory[memberId]) {
        await fetchPaymentHistory(memberId); // refresh history if open
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ Failed to save payment for member ${memberId}`);
    }
  };

  const fetchPaymentHistory = async (memberId: number) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/payments/member/${memberId}`);
      setPaymentHistory(prev => ({ ...prev, [memberId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch payment history', err);
      setStatus(`❌ Failed to fetch history for member ${memberId}`);
    }
  };

  const togglePaymentHistory = async (memberId: number) => {
    if (expandedMemberId === memberId) {
      setExpandedMemberId(null);
      return;
    }
    if (!paymentHistory[memberId]) {
      await fetchPaymentHistory(memberId);
    }
    setExpandedMemberId(memberId);
  };

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Finance Officer View</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, phone, or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-gray-500">🔍</div>
        </div>
      </div>

      {/* Member List */}
      {filteredMembers.map((member) => {
        const history = paymentHistory[member.id] || [];
        const paidMonths = history.map((p) => p.monthPaid);

        return (
          <div key={member.id} className="border p-4 rounded shadow">
            <p><strong>Name:</strong> {member.fullName}</p>
            <p><strong>Phone:</strong> {member.phone}</p>
            <p><strong>Email:</strong> {member.email}</p>

            <div className="mt-2 flex flex-col md:flex-row gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m} {paidMonths.includes(m) ? "✅" : ""}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="border px-2 py-1 rounded w-24"
              />

              <button
                onClick={() => handleSubmitPayment(member.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Record Payment
              </button>
            </div>

            {/* Toggle View History */}
            <button
              onClick={() => togglePaymentHistory(member.id)}
              className="text-blue-600 underline text-sm mt-2"
            >
              {expandedMemberId === member.id ? "Hide Payment History" : "View Full Payment History"}
            </button>

            {/* Payment History */}
            {expandedMemberId === member.id && history && (
              <div className="mt-3 text-sm bg-gray-50 border rounded p-3">
                <h4 className="font-medium text-gray-700 mb-2">Payment History</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {history.map((payment, index) => (
                    <li key={index}>
                      <span className="font-medium">{payment.monthPaid}</span>: ${payment.amount} on{" "}
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {status && <p className="text-sm text-blue-700">{status}</p>}
    </div>
  );
};

export default FinanceOfficerView;