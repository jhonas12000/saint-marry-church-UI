
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
// import { useAuth } from "../../auth/AuthProvider";

// interface Member {
//   id: number;
//   fullName: string;
//   telephone: string;
//   email: string;
//   monthlyPayment?: number;
//   medhaneAlemPledge?: number;
// }

// type Payment = {
//   id: number;
//   amount: number;
//   monthPaid: string;
//   paymentDate: string; // yyyy-mm-dd
// };

// const MONTHS = [
//   "January","February","March","April","May","June",
//   "July","August","September","October","November","December"
// ];

// export default function FinanceOfficerView(): JSX.Element {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [members, setMembers] = useState<Member[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("");

//   // per-member UI state
//   const [paymentsByMember, setPaymentsByMember] = useState<Record<number, Payment[]>>({});
//   const [amountByMember, setAmountByMember] = useState<Record<number, string>>({});
//   const [fromByMember, setFromByMember] = useState<Record<number, string>>({});
//   const [toByMember, setToByMember] = useState<Record<number, string>>({});
//   const [includePledgeByMember, setIncludePledgeByMember] = useState<Record<number, boolean>>({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedMember, setExpandedMember] = useState<number | null>(null);

//   // ------- Data fetching -------
//   const loadMembers = async () => {
//     setLoading(true);
//     setStatus("");
//     try {
//       // baseURL in api = http://localhost:8080/api
//       const { data } = await api.get<Member[]>("/church-members");
//       setMembers(Array.isArray(data) ? data : []);
//     } catch (e: any) {
//       const sc = e?.response?.status;
//       if (sc === 401 || sc === 403) {
//         setStatus("You are not authorized to view members.");
//         // Optionally: navigate("/signin");
//       } else {
//         setStatus("Failed to load members.");
//       }
//       console.error("Failed to load members", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPayments = async (id: number) => {
//     try {
//       const { data } = await api.get<Payment[]>(`/payments/member/${id}`);
//       setPaymentsByMember(prev => ({ ...prev, [id]: data || [] }));
//     } catch (e) {
//       console.error("Failed to load payments", e);
//       setStatus("Failed to load payment history.");
//     }
//   };

//   useEffect(() => {
//     if (user) loadMembers();
//   }, [user]);

//   // ------- Derived helpers -------
//   const monthIndex = (m?: string) => (m ? MONTHS.indexOf(m) : -1);

//   // Auto-calc amount when from/to & monthly exist
//   // Auto-calc amount when from/to & monthly exist (guarded)
// useEffect(() => {
//   setAmountByMember(prev => {
//     let changed = false;
//     const merged = { ...prev };

//     for (const m of members) {
//       const from = fromByMember[m.id];
//       const to = toByMember[m.id];
//       const monthly = m.monthlyPayment || 0;
//       if (!from || !to || monthly <= 0) continue;

//       const fi = MONTHS.indexOf(from);
//       const ti = MONTHS.indexOf(to);
//       if (fi === -1 || ti === -1 || ti < fi) continue;

//       const count = ti - fi + 1;
//       const computed = (monthly * count).toFixed(2);

//       if (merged[m.id] !== computed) {
//         merged[m.id] = computed;
//         changed = true;
//       }
//     }

//     return changed ? merged : prev;
//   });
// }, [fromByMember, toByMember, members]);


//   // Auto-calc "to" when from & amount & monthly exist
// // Auto-calc "to" when from & amount & monthly exist (guarded)
// useEffect(() => {
//   setToByMember(prev => {
//     let changed = false;
//     const merged = { ...prev };

//     for (const m of members) {
//       const from = fromByMember[m.id];
//       const amountStr = amountByMember[m.id];
//       const monthly = m.monthlyPayment || 0;
//       if (!from || !amountStr || monthly <= 0) continue;

//       const fi = MONTHS.indexOf(from);
//       const amount = parseFloat(amountStr);
//       if (fi < 0 || !isFinite(amount) || amount <= 0) continue;

//       const monthsCovered = Math.floor(amount / monthly);
//       const ti = fi + monthsCovered - 1;
//       if (ti >= fi && ti < MONTHS.length) {
//         const computedTo = MONTHS[ti];
//         if (merged[m.id] !== computedTo) {
//           merged[m.id] = computedTo;
//           changed = true;
//         }
//       }
//     }

//     return changed ? merged : prev;
//   });
// }, [amountByMember, fromByMember, members]);


//   // ------- UI interactions -------
//   const togglePayments = (id: number) => {
//     setIncludePledgeByMember(prev => ({ ...prev, [id]: false }));
//     if (expandedMember === id) {
//       setExpandedMember(null);
//     } else {
//       setExpandedMember(id);
//       fetchPayments(id);
//     }
//   };

//   const handleSubmitPayment = async (member: Member) => {
//     setStatus("");
//     const todayStr = new Date().toISOString().split("T")[0];

//     // Pledge flow
//     if (includePledgeByMember[member.id]) {
//       if (!member.medhaneAlemPledge || member.medhaneAlemPledge <= 0) {
//         setStatus("Invalid pledge amount.");
//         return;
//       }
//       try {
//         await api.post("/payments", {
//           amount: member.medhaneAlemPledge,
//           monthPaid: "Medhane Alem",
//           paymentDate: todayStr,
//           churchMember: { id: member.id },
//         });
//         setStatus("Pledge recorded.");
//         await fetchPayments(member.id);
//         setExpandedMember(member.id);
//       } catch (e) {
//         console.error(e);
//         setStatus("Failed to record pledge.");
//       }
//       return;
//     }

//     // Monthly flow
//     const from = fromByMember[member.id];
//     const amount = parseFloat(amountByMember[member.id] || "");
//     const monthly = member.monthlyPayment || 0;
//     if (!from || !isFinite(amount) || amount <= 0 || monthly <= 0) {
//       setStatus("Invalid month or amount.");
//       return;
//     }

//     const fi = monthIndex(from);
//     if (fi < 0) {
//       setStatus("Invalid start month.");
//       return;
//     }

//     const count = Math.floor(amount / monthly);
//     if (count <= 0) {
//       setStatus("Amount is less than one month.");
//       return;
//     }

//     try {
//       // record each month as a separate payment
//       for (let i = 0; i < count; i++) {
//         const idx = fi + i;
//         const monthName = MONTHS[idx % 12];
//         await api.post("/payments", {
//           amount: monthly,
//           monthPaid: monthName,
//           paymentDate: todayStr,
//           churchMember: { id: member.id },
//         });
//       }
//       setStatus(`Recorded ${count} payment${count > 1 ? "s" : ""}.`);
//       await fetchPayments(member.id);
//       setExpandedMember(member.id);
//     } catch (e) {
//       console.error(e);
//       setStatus("Failed to record payments.");
//     }
//   };

//   const handleDeletePayment = async (memberId: number, paymentId: number) => {
//     setStatus("");
//     try {
//       //await api.delete(`/payments/${paymentId}`);
//       await api.delete(`/payments/${paymentId}/${memberId}`);
//       setStatus("Payment deleted.");
//       await fetchPayments(memberId);
//     } catch (e) {
//       console.error(e);
//       setStatus("Failed to delete payment.");
//     }
//   };

//   const filtered = useMemo(
//     () =>
//       members.filter((m) => {
//         const q = searchQuery.trim().toLowerCase();
//         if (!q) return true;
//         return (
//           m.fullName.toLowerCase().includes(q) ||
//           (m.telephone || "").includes(q)
//         );
//       }),
//     [members, searchQuery]
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
//       <div className="flex flex-col md:flex-row justify-between items-center">
//         <h2 className="text-2xl font-bold mb-2 md:mb-0">Finance Officer View</h2>
//         <input
//           type="text"
//           placeholder="Search by name or phone"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border px-4 py-2 rounded w-full md:w-64"
//         />
//       </div>

//       {status && (
//         <div
//           className={`p-3 rounded text-sm font-medium ${
//             status.startsWith("Recorded") || status.includes("deleted")
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {status}
//         </div>
//       )}

//       {loading && <p>Loading members…</p>}

//       {!loading &&
//         filtered.map((member) => (
//           <div
//             key={member.id}
//             className="border rounded-lg shadow p-4 space-y-3 bg-white"
//           >
//             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
//               <div className="space-y-1 text-sm">
//                 <p className="font-semibold text-lg">{member.fullName}</p>
//                 <p>📞 {member.telephone}</p>
//                 <p>📧 {member.email}</p>
//                 <p>💵 Monthly: ${member.monthlyPayment ?? 0}</p>
//               </div>

//               <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={includePledgeByMember[member.id] || false}
//                     onChange={(e) =>
//                       setIncludePledgeByMember((prev) => ({
//                         ...prev,
//                         [member.id]: e.target.checked,
//                       }))
//                     }
//                   />
//                   Record Medhane Alem
//                 </label>

//                 {!includePledgeByMember[member.id] && (
//                   <>
//                     <div className="flex gap-2">
//                       <select
//                         value={fromByMember[member.id] || ""}
//                         onChange={(e) =>
//                           setFromByMember((prev) => ({
//                             ...prev,
//                             [member.id]: e.target.value,
//                           }))
//                         }
//                         className="border rounded px-2 py-1"
//                       >
//                         <option value="">From</option>
//                         {MONTHS.map((m) => (
//                           <option key={m} value={m}>
//                             {m}
//                           </option>
//                         ))}
//                       </select>

//                       <select
//                         value={toByMember[member.id] || ""}
//                         onChange={(e) =>
//                           setToByMember((prev) => ({
//                             ...prev,
//                             [member.id]: e.target.value,
//                           }))
//                         }
//                         className="border rounded px-2 py-1"
//                       >
//                         <option value="">To</option>
//                         {fromByMember[member.id] &&
//                           MONTHS.slice(monthIndex(fromByMember[member.id]))
//                             .map((m) => (
//                               <option key={m} value={m}>
//                                 {m}
//                               </option>
//                             ))}
//                       </select>
//                     </div>

//                     <input
//                       type="number"
//                       placeholder="Total"
//                       value={amountByMember[member.id] || ""}
//                       onChange={(e) =>
//                         setAmountByMember((prev) => ({
//                           ...prev,
//                           [member.id]: e.target.value,
//                         }))
//                       }
//                       className="border rounded px-2 py-1"
//                     />
//                   </>
//                 )}

//                 <button
//                   onClick={() => handleSubmitPayment(member)}
//                   className="bg-green-600 text-white py-1 px-3 rounded"
//                 >
//                   Record Payment
//                 </button>
//                 <button
//                   onClick={() => togglePayments(member.id)}
//                   className="bg-blue-600 text-white py-1 px-3 rounded"
//                 >
//                   {expandedMember === member.id
//                     ? "Hide Payments"
//                     : "View Payments"}
//                 </button>
//               </div>
//             </div>

//             {expandedMember === member.id &&
//               paymentsByMember[member.id] && (
//                 <div className="mt-3 bg-gray-50 rounded p-3">
//                   <h3 className="font-medium mb-2">Payment History</h3>
//                   <table className="w-full text-sm border-collapse">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border px-2 py-1 text-left">Date</th>
//                         <th className="border px-2 py-1 text-right">Amount</th>
//                         <th className="border px-2 py-1">Month</th>
//                         <th className="border px-2 py-1">Year</th>
//                         <th className="border px-2 py-1">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {paymentsByMember[member.id].map((p) => {
//                         const local = new Date(`${p.paymentDate}T00:00:00`);
//                         return (
//                           <tr key={p.id}>
//                             <td className="border px-2 py-1">
//                               {local.toLocaleDateString()}
//                             </td>
//                             <td className="border px-2 py-1 text-right">
//                               ${Number(p.amount).toFixed(2)}
//                             </td>
//                             <td className="border px-2 py-1 text-center">
//                               {p.monthPaid}
//                             </td>
//                             <td className="border px-2 py-1 text-center">
//                               {local.getFullYear()}
//                             </td>
//                             <td className="border px-2 py-1 text-center">
//                               <button
//                                 onClick={() =>
//                                   handleDeletePayment(member.id, p.id)
//                                 }
//                                 className="text-red-600 hover:underline text-xs"
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </div>
//         ))}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";

interface ChurchMemberDTO {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address?: string | null;
  monthlyPayment?: number | null;
  medhaneAlemPledge?: number | null;
  memberSince?: string | null; // if your backend uses 'joinDate' or 'createdAt', we’ll handle it below
  joinDate?: string | null;
  createdAt?: string | null;
}

interface Member {
  id: number;
  fullName: string;
  telephone: string;
  email: string;
  monthlyPayment?: number | null;
  medhaneAlemPledge?: number | null;
  address?: string | null;
  memberSince?: string | null; // ISO string
}

type Payment = {
  id: number;
  amount: number;
  monthPaid: string;
  paymentDate: string; // yyyy-mm-dd
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function FinanceOfficerView(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // per-member UI state
  const [paymentsByMember, setPaymentsByMember] = useState<Record<number, Payment[]>>({});
  const [amountByMember, setAmountByMember] = useState<Record<number, string>>({});
  const [fromByMember, setFromByMember] = useState<Record<number, string>>({});
  const [toByMember, setToByMember] = useState<Record<number, string>>({});
  const [includePledgeByMember, setIncludePledgeByMember] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  // ------- Data fetching -------
  const loadMembers = async () => {
    setLoading(true);
    setStatus("");
    try {
      // baseURL in api = http://localhost:8080/api
      const { data } = await api.get<ChurchMemberDTO[]>("/church-members");

      // 🔽 map backend DTO -> Member used in this component
      const mapped: Member[] = (Array.isArray(data) ? data : []).map((d) => ({
        id: d.id,
        fullName: [d.firstName, d.lastName].filter(Boolean).join(" ").trim(),
        telephone: d.telephone,
        email: d.email,
        monthlyPayment: d.monthlyPayment ?? null,
        medhaneAlemPledge: d.medhaneAlemPledge ?? null,
        address: d.address ?? null,
        memberSince: d.memberSince ?? d.joinDate ?? d.createdAt ?? null,
      }));

      setMembers(mapped);
    } catch (e: any) {
      const sc = e?.response?.status;
      if (sc === 401 || sc === 403) {
        setStatus("You are not authorized to view members.");
        // Optionally: navigate("/signin");
      } else {
        setStatus("Failed to load members.");
      }
      console.error("Failed to load members", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (id: number) => {
    try {
      const { data } = await api.get<Payment[]>(`/payments/member/${id}`);
      setPaymentsByMember(prev => ({ ...prev, [id]: data || [] }));
    } catch (e) {
      console.error("Failed to load payments", e);
      setStatus("Failed to load payment history.");
    }
  };

  useEffect(() => {
    if (user) loadMembers();
  }, [user]);

  // ------- Derived helpers -------
  const monthIndex = (m?: string) => (m ? MONTHS.indexOf(m) : -1);

  // Auto-calc amount when from/to & monthly exist (guarded)
  useEffect(() => {
    setAmountByMember(prev => {
      let changed = false;
      const merged = { ...prev };

      for (const m of members) {
        const from = fromByMember[m.id];
        const to = toByMember[m.id];
        const monthly = m.monthlyPayment || 0;
        if (!from || !to || monthly <= 0) continue;

        const fi = MONTHS.indexOf(from);
        const ti = MONTHS.indexOf(to);
        if (fi === -1 || ti === -1 || ti < fi) continue;

        const count = ti - fi + 1;
        const computed = (monthly * count).toFixed(2);

        if (merged[m.id] !== computed) {
          merged[m.id] = computed;
          changed = true;
        }
      }

      return changed ? merged : prev;
    });
  }, [fromByMember, toByMember, members]);

  // Auto-calc "to" when from & amount & monthly exist (guarded)
  useEffect(() => {
    setToByMember(prev => {
      let changed = false;
      const merged = { ...prev };

      for (const m of members) {
        const from = fromByMember[m.id];
        const amountStr = amountByMember[m.id];
        const monthly = m.monthlyPayment || 0;
        if (!from || !amountStr || monthly <= 0) continue;

        const fi = MONTHS.indexOf(from);
        const amount = parseFloat(amountStr);
        if (fi < 0 || !isFinite(amount) || amount <= 0) continue;

        const monthsCovered = Math.floor(amount / monthly);
        const ti = fi + monthsCovered - 1;
        if (ti >= fi && ti < MONTHS.length) {
          const computedTo = MONTHS[ti];
          if (merged[m.id] !== computedTo) {
            merged[m.id] = computedTo;
            changed = true;
          }
        }
      }

      return changed ? merged : prev;
    });
  }, [amountByMember, fromByMember, members]);

  // ------- UI interactions -------
  const togglePayments = (id: number) => {
    setIncludePledgeByMember(prev => ({ ...prev, [id]: false }));
    if (expandedMember === id) {
      setExpandedMember(null);
    } else {
      setExpandedMember(id);
      fetchPayments(id);
    }
  };

  const handleSubmitPayment = async (member: Member) => {
    setStatus("");
    const todayStr = new Date().toISOString().split("T")[0];

    // Pledge flow
    if (includePledgeByMember[member.id]) {
      if (!member.medhaneAlemPledge || member.medhaneAlemPledge <= 0) {
        setStatus("Invalid pledge amount.");
        return;
      }
      try {
        await api.post("/payments", {
          amount: member.medhaneAlemPledge,
          monthPaid: "Medhane Alem",
          paymentDate: todayStr,
          churchMember: { id: member.id },
        });
        setStatus("Pledge recorded.");
        await fetchPayments(member.id);
        setExpandedMember(member.id);
      } catch (e) {
        console.error(e);
        setStatus("Failed to record pledge.");
      }
      return;
    }

    // Monthly flow
    const from = fromByMember[member.id];
    const amount = parseFloat(amountByMember[member.id] || "");
    const monthly = member.monthlyPayment || 0;
    if (!from || !isFinite(amount) || amount <= 0 || monthly <= 0) {
      setStatus("Invalid month or amount.");
      return;
    }

    const fi = monthIndex(from);
    if (fi < 0) {
      setStatus("Invalid start month.");
      return;
    }

    const count = Math.floor(amount / monthly);
    if (count <= 0) {
      setStatus("Amount is less than one month.");
      return;
    }

    try {
      for (let i = 0; i < count; i++) {
        const idx = fi + i;
        const monthName = MONTHS[idx % 12];
        await api.post("/payments", {
          amount: monthly,
          monthPaid: monthName,
          paymentDate: todayStr,
          churchMember: { id: member.id },
        });
      }
      setStatus(`Recorded ${count} payment${count > 1 ? "s" : ""}.`);
      await fetchPayments(member.id);
      setExpandedMember(member.id);
    } catch (e) {
      console.error(e);
      setStatus("Failed to record payments.");
    }
  };

  const handleDeletePayment = async (memberId: number, paymentId: number) => {
    setStatus("");
    try {
      await api.delete(`/payments/${paymentId}/${memberId}`);
      setStatus("Payment deleted.");
      await fetchPayments(memberId);
    } catch (e) {
      console.error(e);
      setStatus("Failed to delete payment.");
    }
  };

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          m.fullName.toLowerCase().includes(q) ||
          (m.telephone || "").includes(q)
        );
      }),
    [members, searchQuery]
  );

  const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString() : "—";

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Finance Officer View</h2>
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-64"
        />
      </div>

      {status && (
        <div
          className={`p-3 rounded text-sm font-medium ${
            status.startsWith("Recorded") || status.includes("deleted")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </div>
      )}

      {loading && <p>Loading members…</p>}

      {!loading &&
        filtered.map((member) => (
          <div
            key={member.id}
            className="border rounded-lg shadow p-4 space-y-3 bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-lg">{member.fullName}</p>
                <p>📞 {member.telephone ?? "—"}</p>
                <p>📧 {member.email ?? "—"}</p>
                {/* <p>🏠 Address: {member.address ?? "—"}</p> */}
                <p>💵 Monthly: ${member.monthlyPayment ?? "—"}</p>
                <p>🏛️ Medhane-Alem: ${member.medhaneAlemPledge ?? "—"}</p>
                <p>📅 Member since: {fmtDate(member.memberSince)}</p>
              </div>

              <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includePledgeByMember[member.id] || false}
                    onChange={(e) =>
                      setIncludePledgeByMember((prev) => ({
                        ...prev,
                        [member.id]: e.target.checked,
                      }))
                    }
                  />
                  Record Medhane Alem
                </label>

                {!includePledgeByMember[member.id] && (
                  <>
                    <div className="flex gap-2">
                      <select
                        value={fromByMember[member.id] || ""}
                        onChange={(e) =>
                          setFromByMember((prev) => ({
                            ...prev,
                            [member.id]: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="">From</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      <select
                        value={toByMember[member.id] || ""}
                        onChange={(e) =>
                          setToByMember((prev) => ({
                            ...prev,
                            [member.id]: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="">To</option>
                        {fromByMember[member.id] &&
                          MONTHS.slice(MONTHS.indexOf(fromByMember[member.id]!)).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                      </select>
                    </div>

                    <input
                      type="number"
                      placeholder="Total"
                      value={amountByMember[member.id] || ""}
                      onChange={(e) =>
                        setAmountByMember((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1"
                    />
                  </>
                )}

                <button
                  onClick={() => handleSubmitPayment(member)}
                  className="bg-green-600 text-white py-1 px-3 rounded"
                >
                  Record Payment
                </button>
                <button
                  onClick={() => togglePayments(member.id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded"
                >
                  {expandedMember === member.id
                    ? "Hide Payments"
                    : "View Payments"}
                </button>
              </div>
            </div>

            {expandedMember === member.id &&
              paymentsByMember[member.id] && (
                <div className="mt-3 bg-gray-50 rounded p-3">
                  <h3 className="font-medium mb-2">Payment History</h3>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Date</th>
                        <th className="border px-2 py-1 text-right">Amount</th>
                        <th className="border px-2 py-1">Month</th>
                        <th className="border px-2 py-1">Year</th>
                        <th className="border px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsByMember[member.id].map((p) => {
                        const local = new Date(`${p.paymentDate}T00:00:00`);
                        return (
                          <tr key={p.id}>
                            <td className="border px-2 py-1">
                              {local.toLocaleDateString()}
                            </td>
                            <td className="border px-2 py-1 text-right">
                              ${Number(p.amount).toFixed(2)}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {p.monthPaid}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              {local.getFullYear()}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <button
                                onClick={() =>
                                  handleDeletePayment(member.id, p.id)
                                }
                                className="text-red-600 hover:underline text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        ))}
    </div>
  );
}
