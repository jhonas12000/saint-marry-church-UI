// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import api from "../api/api";
// import { formatYMDForDisplay } from "../utils/date";


// interface PizzaContribution {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email?: string | null;
//   telephone: string;
//   amount: number;
//   paymentDate: string; // yyyy-mm-dd
// }

// type FamilyRow = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   telephone: string;
//   payments: { amount: number; paymentDate: string }[]; // latest 4
// };

// type SortKey = "firstName" | "lastName" | "email" | "telephone";
// type SortDir = "asc" | "desc";

// function currency(n: number) {
//   if (Number.isNaN(n)) return "-";
//   try {
//     return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
//   } catch {
//     return `$${n.toFixed(2)}`;
//   }
// }
// function fmtPayment(p?: { amount: number; paymentDate: string }) {
//   if (!p) return "";
//   return `${currency(p.amount)} — ${formatYMDForDisplay(p.paymentDate)}`;
// }
// const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
//   <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>{children}</div>
// );

// const PizzaFamilyPage: React.FC = () => {
//   const [rows, setRows] = useState<FamilyRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [sortKey, setSortKey] = useState<SortKey>("lastName");
//   const [sortDir, setSortDir] = useState<SortDir>("asc");

//   const navigate = useNavigate();
//   const location = useLocation() as { state?: { message?: string; from?: string } };
//   const successMsg = location.state?.message;

//   //const SIDEBAR_ROUTE = "/members"; // change if your sidebar/landing route is different

//   function goBackToSidebar() {
//   // Always land on Members; don't rely on history or state
//   navigate("/members", { replace: true });
// }

//   async function refresh() {
//     setLoading(true);
//     setErr(null);
//     try {
//       // If your axios baseURL ALREADY includes "/api", keep the path as "/pizza-contributions".
//       // If not, change to "/api/pizza-contributions".
//       const { data } = await api.get<PizzaContribution[]>("/pizza-contributions");

//       const map = new Map<string, FamilyRow>();
//       for (const c of data) {
//         const key = [
//           (c.firstName || "").trim().toLowerCase(),
//           (c.lastName || "").trim().toLowerCase(),
//           (c.email || "").trim().toLowerCase(),
//           (c.telephone || "").trim().toLowerCase(),
//         ].join("|");

//         if (!map.has(key)) {
//           map.set(key, {
//             firstName: c.firstName ?? "",
//             lastName: c.lastName ?? "",
//             email: (c.email ?? "") || "",
//             telephone: c.telephone ?? "",
//             payments: [],
//           });
//         }
//         map.get(key)!.payments.push({
//           amount: Number(c.amount ?? 0),
//           paymentDate: c.paymentDate,
//         });
//       }

//       const result: FamilyRow[] = [];
//       map.forEach((row) => {
//         row.payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
//         row.payments.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
//         row.payments = row.payments.slice(0, 4);
//         result.push(row);
//       });

//       setRows(result);
//     } catch (e: any) {
//       console.error(e);
//       setErr(e?.response?.data?.message || "Failed to load pizza families.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     refresh();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const totalFamilies = useMemo(() => rows.length, [rows]);

//   // --- search + sort ---
//   const viewRows = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const filtered = !q
//       ? rows
//       : rows.filter((r) =>
//           [r.firstName, r.lastName, r.email, r.telephone]
//             .join(" ")
//             .toLowerCase()
//             .includes(q)
//         );

//     const sorted = [...filtered].sort((a, b) => {
//       const av = (a[sortKey] || "").toString().toLowerCase();
//       const bv = (b[sortKey] || "").toString().toLowerCase();
//       if (av < bv) return sortDir === "asc" ? -1 : 1;
//       if (av > bv) return sortDir === "asc" ? 1 : -1;
//       // tie-breaker: lastName then firstName
//       const t1 = a.lastName.localeCompare(b.lastName);
//       if (t1 !== 0) return t1;
//       return a.firstName.localeCompare(b.firstName);
//     });

//     return sorted;
//   }, [rows, search, sortKey, sortDir]);

//   function headerSort(nextKey: SortKey) {
//     if (sortKey === nextKey) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(nextKey);
//       setSortDir("asc");
//     }
//   }
//   function sortIndicator(k: SortKey) {
//     return sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "";
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center gap-2">
//         <button
//           onClick={goBackToSidebar}
//           type="button"
//           className="px-3 py-1.5 rounded-xl border hover:bg-gray-50"
//         >
//           ← Sidebar
//         </button>

//         <h1 className="text-2xl font-bold">Pizza Family</h1>

//         <div className="ml-auto flex items-center gap-2">
//           {/* Search */}
//           <input
//             placeholder="Search name, email, phone…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-xl px-3 py-1.5 w-56"
//           />
//           <Link
//             to="/pizza-family/add"
//             className="px-4 py-2 rounded-2xl shadow text-white bg-blue-600 hover:bg-blue-700"
//           >
//             Add Member
//           </Link>
//         </div>
//       </div>

//       {successMsg && (
//         <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-2">
//           {successMsg}
//         </div>
//       )}

//       <Card>
//         {loading ? (
//           <div className="text-gray-600">Loading…</div>
//         ) : err ? (
//           <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2">{err}</div>
//         ) : (
//           <>
//             <div className="mb-3 text-sm text-gray-600">
//               Families: <b>{totalFamilies}</b> • Showing: <b>{viewRows.length}</b>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-600 border-b select-none">
//                     <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("firstName")}>
//                       First Name{sortIndicator("firstName")}
//                     </th>
//                     <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("lastName")}>
//                       Last Name{sortIndicator("lastName")}
//                     </th>
//                     <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("email")}>
//                       Email{sortIndicator("email")}
//                     </th>
//                     <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("telephone")}>
//                       Telephone{sortIndicator("telephone")}
//                     </th>
//                     <th className="py-2 pr-4">1st Payment</th>
//                     <th className="py-2 pr-4">2nd Payment</th>
//                     <th className="py-2 pr-4">3rd Payment</th>
//                     <th className="py-2 pr-4">4th Payment</th>
//                     <th className="py-2 pr-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {viewRows.length === 0 ? (
//                     <tr>
//                       <td className="py-3 pr-4 text-gray-600" colSpan={9}>
//                         No data found.
//                       </td>
//                     </tr>
//                   ) : (
//                     viewRows.map((r, i) => (
//                       <tr key={`${r.firstName}-${r.lastName}-${r.email}-${r.telephone}-${i}`} className="border-b last:border-b-0">
//                         <td className="py-2 pr-4">{r.firstName}</td>
//                         <td className="py-2 pr-4">{r.lastName}</td>
//                         <td className="py-2 pr-4">{r.email || "-"}</td>
//                         <td className="py-2 pr-4">{r.telephone}</td>
//                         <td className="py-2 pr-4">{fmtPayment(r.payments[0])}</td>
//                         <td className="py-2 pr-4">{fmtPayment(r.payments[1])}</td>
//                         <td className="py-2 pr-4">{fmtPayment(r.payments[2])}</td>
//                         <td className="py-2 pr-4">{fmtPayment(r.payments[3])}</td>
//                         <td className="py-2 pr-4">
//                           <Link
//                             to={`/pizza-family/manage/${encodeURIComponent(r.telephone)}`}
//                             className="px-3 py-1.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700"
//                           >
//                             Manage
//                           </Link>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default PizzaFamilyPage;

// src/pages/PizzaFamilyPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { formatYMDForDisplay } from "../utils/date";

interface PizzaContribution {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  telephone: string;
  amount: number;
  paymentDate: string; // yyyy-mm-dd
}

type FamilyRow = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  payments: { amount: number; paymentDate: string }[]; // latest 4
};

type SortKey = "firstName" | "lastName" | "email" | "telephone";
type SortDir = "asc" | "desc";

function currency(n: number) {
  if (Number.isNaN(n)) return "-";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}
function fmtPayment(p?: { amount: number; paymentDate: string }) {
  if (!p) return "";
  return `${currency(p.amount)} — ${formatYMDForDisplay(p.paymentDate)}`;
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>{children}</div>
);

const PizzaFamilyPage: React.FC = () => {
  const [rows, setRows] = useState<FamilyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const navigate = useNavigate();
  const location = useLocation() as { state?: { message?: string; from?: string } };
  const successMsg = location.state?.message;

  function goBackToSidebar() {
    navigate("/members", { replace: true });
  }

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<PizzaContribution[]>("/pizza-contributions");

      const map = new Map<string, FamilyRow>();
      for (const c of data) {
        const key = [
          (c.firstName || "").trim().toLowerCase(),
          (c.lastName || "").trim().toLowerCase(),
          (c.email || "").trim().toLowerCase(),
          (c.telephone || "").trim().toLowerCase(),
        ].join("|");

        if (!map.has(key)) {
          map.set(key, {
            firstName: c.firstName ?? "",
            lastName: c.lastName ?? "",
            email: (c.email ?? "") || "",
            telephone: c.telephone ?? "",
            payments: [],
          });
        }
        map.get(key)!.payments.push({
          amount: Number(c.amount ?? 0),
          paymentDate: c.paymentDate,
        });
      }

      const result: FamilyRow[] = [];
      map.forEach((row) => {
        // sort payments newest → oldest, keep latest 4
        row.payments.sort(
          (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
        row.payments = row.payments.slice(0, 4);
        result.push(row);
      });

      setRows(result);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load pizza families.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalFamilies = useMemo(() => rows.length, [rows]);

  // --- search + sort ---
  const viewRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = !q
      ? rows
      : rows.filter((r) =>
          [r.firstName, r.lastName, r.email, r.telephone].join(" ").toLowerCase().includes(q)
        );

    const sorted = [...filtered].sort((a, b) => {
      const av = (a[sortKey] || "").toString().toLowerCase();
      const bv = (b[sortKey] || "").toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      const t1 = a.lastName.localeCompare(b.lastName); // tie-breaker
      if (t1 !== 0) return t1;
      return a.firstName.localeCompare(b.firstName);
    });

    return sorted;
  }, [rows, search, sortKey, sortDir]);

  function headerSort(nextKey: SortKey) {
    if (sortKey === nextKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
  }
  function sortIndicator(k: SortKey) {
    return sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : "";
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header: mobile-friendly stacking */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={goBackToSidebar}
            type="button"
            className="px-3 py-1.5 rounded-xl border hover:bg-gray-50"
          >
            ← Members
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Pizza Family</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:ml-auto gap-2 sm:items-center">
          <input
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full sm:w-64"
          />
          <Link
            to="/pizza-family/add"
            className="text-center px-4 py-2 rounded-2xl shadow text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Member
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-2">
          {successMsg}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : err ? (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2">
            {err}
          </div>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-600">
              Families: <b>{totalFamilies}</b> • Showing: <b>{viewRows.length}</b>
            </div>

            {/* Mobile view: cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {viewRows.length === 0 ? (
                <div className="text-gray-600">No data found.</div>
              ) : (
                viewRows.map((r, i) => (
                  <div
                    key={`${r.firstName}-${r.lastName}-${r.email}-${r.telephone}-${i}`}
                    className="rounded-xl border p-4 bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-base">
                          {r.firstName} {r.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{r.email || "-"}</div>
                        <div className="text-sm text-gray-700 mt-0.5">{r.telephone}</div>
                      </div>
                      <Link
                        to={`/pizza-family/manage/${encodeURIComponent(r.telephone)}`}
                        className="shrink-0 px-3 py-1.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Manage
                      </Link>
                    </div>

                    {r.payments.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Recent payments</div>
                        <ul className="text-sm text-gray-800 space-y-1">
                          {r.payments.map((p, idx) => (
                            <li key={idx} className="flex justify-between gap-3">
                              <span className="truncate">{formatYMDForDisplay(p.paymentDate)}</span>
                              <span className="font-medium">{currency(p.amount)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Desktop/tablet view: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b select-none">
                    <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("firstName")}>
                      First Name{sortIndicator("firstName")}
                    </th>
                    <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("lastName")}>
                      Last Name{sortIndicator("lastName")}
                    </th>
                    <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("email")}>
                      Email{sortIndicator("email")}
                    </th>
                    <th className="py-2 pr-4 cursor-pointer" onClick={() => headerSort("telephone")}>
                      Telephone{sortIndicator("telephone")}
                    </th>
                    <th className="py-2 pr-4">1st Payment</th>
                    <th className="py-2 pr-4">2nd Payment</th>
                    <th className="py-2 pr-4">3rd Payment</th>
                    <th className="py-2 pr-4">4th Payment</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewRows.length === 0 ? (
                    <tr>
                      <td className="py-3 pr-4 text-gray-600" colSpan={9}>
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    viewRows.map((r, i) => (
                      <tr
                        key={`${r.firstName}-${r.lastName}-${r.email}-${r.telephone}-${i}`}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-2 pr-4">{r.firstName}</td>
                        <td className="py-2 pr-4">{r.lastName}</td>
                        <td className="py-2 pr-4">{r.email || "-"}</td>
                        <td className="py-2 pr-4">{r.telephone}</td>
                        <td className="py-2 pr-4">{fmtPayment(r.payments[0])}</td>
                        <td className="py-2 pr-4">{fmtPayment(r.payments[1])}</td>
                        <td className="py-2 pr-4">{fmtPayment(r.payments[2])}</td>
                        <td className="py-2 pr-4">{fmtPayment(r.payments[3])}</td>
                        <td className="py-2 pr-4">
                          <Link
                            to={`/pizza-family/manage/${encodeURIComponent(r.telephone)}`}
                            className="px-3 py-1.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PizzaFamilyPage;

