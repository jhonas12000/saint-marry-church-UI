// // src/pages/TransactionDetail.tsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import api from "../api/api";

// type FinanceRecord = {
//   id: number;
//   date: string;
//   income: number | null;
//   expense: number | null;
//   description: string;
// };

// const TransactionDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [record, setRecord] = useState<FinanceRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string>("");

//   useEffect(() => {
//     if (!id) return;
//     const run = async () => {
//       setLoading(true);
//       setErr("");
//       try {
//         // IMPORTANT: use the shared axios instance that attaches the token
//         const { data } = await api.get<FinanceRecord>(`/transactions/${id}`);
//         setRecord(data);
//       } catch (e: any) {
//         const status = e?.response?.status;
//         if (status === 401) setErr("Unauthorized. Please sign in again.");
//         else if (status === 403) setErr("Forbidden. You don't have access to this transaction.");
//         else setErr(e?.response?.data?.message ?? "Failed to load transaction.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     run();
//   }, [id]);

//   if (loading) return <div className="p-6 text-center">Loading transaction…</div>;

//   if (err) {
//     return (
//       <div className="p-6 max-w-xl mx-auto">
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//           {err}
//         </div>
//         <div className="mt-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-4 py-2 rounded-md border hover:bg-gray-50"
//           >
//             ← Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!record) return null;

//   const income = Number(record.income ?? 0).toFixed(2);
//   const expense = Number(record.expense ?? 0).toFixed(2);

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-4">
//       <div>
//         <Link to="/finance" className="text-blue-600 hover:underline">← Back to Finance</Link>
//       </div>

//       <h1 className="text-2xl font-bold">Transaction #{record.id}</h1>

//       <div className="rounded-xl bg-white border p-4 shadow">
//         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <dt className="text-gray-500 text-sm">Date</dt>
//             <dd className="font-medium">{new Date(record.date).toLocaleDateString()}</dd>
//           </div>
//           <div>
//             <dt className="text-gray-500 text-sm">Income</dt>
//             <dd className="font-medium text-green-700">${income}</dd>
//           </div>
//           <div>
//             <dt className="text-gray-500 text-sm">Expense</dt>
//             <dd className="font-medium text-red-700">${expense}</dd>
//           </div>
//           <div className="sm:col-span-2">
//             <dt className="text-gray-500 text-sm">Description</dt>
//             <dd className="font-medium">{record.description || "—"}</dd>
//           </div>
//         </dl>
//       </div>
//     </div>
//   );
// };

// export default TransactionDetail;
// src/pages/TransactionDetail.tsx
// src/pages/TransactionDetail.tsx
// src/pages/TransactionDetail.tsx


// src/pages/TransactionDetail.tsx
// src/pages/TransactionDetail.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
// src/pages/Finance.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const API_PATH = "/transactions";

type Tx = {
  id: number;
  date: string;
  income: number | null;
  expense: number | null;
  description: string;
  personInvolved?: string | null;
};

type Period = "monthly" | "quarterly" | "yearly" | "custom";

// helpers
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const toDate = (s: string) => {
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const quarterForMonth = (m: number) => Math.floor(m / 3) + 1;
const quarterStartMonth = (q: number) => (Math.max(1, Math.min(4, q)) - 1) * 3;
const fmtRange = (s: Date, e: Date) => `${s.toLocaleDateString()} – ${e.toLocaleDateString()}`;

const Finance: React.FC = () => {
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const now = new Date();
  const [period, setPeriod] = useState<Period>("monthly");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [quarter, setQuarter] = useState(quarterForMonth(now.getMonth()));
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get<Tx[]>(API_PATH);
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => {
          const ta = Date.parse(a.date || "");
          const tb = Date.parse(b.date || "");
          if (isNaN(ta) && isNaN(tb)) return 0;
          if (isNaN(ta)) return 1;
          if (isNaN(tb)) return -1;
          return tb - ta;
        });
        setItems(sorted);
      } catch (e: any) {
        const s = e?.response?.status;
        setErr(
          s === 401
            ? "Unauthorized. Please sign in again."
            : s === 403
            ? "Forbidden. You don't have access to Finance."
            : e?.response?.data?.message ?? "Failed to load transactions."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const [rangeStart, rangeEnd] = useMemo<[Date | null, Date | null]>(() => {
    if (period === "yearly") {
      const s = new Date(year, 0, 1);
      const e = new Date(year, 11, 31);
      return [startOfDay(s), endOfDay(e)];
    }
    if (period === "quarterly") {
      const m0 = quarterStartMonth(quarter);
      const s = new Date(year, m0, 1);
      const e = new Date(year, m0 + 3, 0);
      return [startOfDay(s), endOfDay(e)];
    }
    if (period === "monthly") {
      const m = clamp(month, 1, 12) - 1;
      const s = new Date(year, m, 1);
      const e = new Date(year, m + 1, 0);
      return [startOfDay(s), endOfDay(e)];
    }
    const s = customStart ? toDate(customStart) : null;
    const e = customEnd ? toDate(customEnd) : null;
    return [s ? startOfDay(s) : null, e ? endOfDay(e) : null];
  }, [period, year, month, quarter, customStart, customEnd]);

  const filtered = useMemo(() => {
    if (!rangeStart && !rangeEnd) return items;
    return items.filter((tx) => {
      const d = toDate(tx.date);
      if (!d) return false;
      const t = d.getTime();
      if (rangeStart && t < rangeStart.getTime()) return false;
      if (rangeEnd && t > rangeEnd.getTime()) return false;
      return true;
    });
  }, [items, rangeStart, rangeEnd]);

  const totals = useMemo(() => {
    const income = filtered.reduce((s, t) => s + Number(t.income ?? 0), 0);
    const expense = filtered.reduce((s, t) => s + Number(t.expense ?? 0), 0);
    const balance = income - expense;
    return {
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: balance.toFixed(2),
    };
  }, [filtered]);

  const shiftPeriod = (dir: -1 | 1) => {
    if (period === "yearly") {
      setYear((y) => y + dir);
    } else if (period === "quarterly") {
      setQuarter((q) => {
        const nextQ = q + dir;
        if (nextQ < 1) {
          setYear((y) => y - 1);
          return 4;
        }
        if (nextQ > 4) {
          setYear((y) => y + 1);
          return 1;
        }
        return nextQ;
      });
    } else if (period === "monthly") {
      setMonth((m) => {
        const nextM = m + dir;
        if (nextM < 1) {
          setYear((y) => y - 1);
          return 12;
        }
        if (nextM > 12) {
          setYear((y) => y + 1);
          return 1;
        }
        return nextM;
      });
    }
  };

  const clearFilters = () => {
    const n = new Date();
    setPeriod("monthly");
    setYear(n.getFullYear());
    setMonth(n.getMonth() + 1);
    setQuarter(quarterForMonth(n.getMonth()));
    setCustomStart("");
    setCustomEnd("");
  };

  const rangeLabel = useMemo(() => {
    if (period === "yearly") return `${year}`;
    if (period === "quarterly") return `Q${quarter} ${year}`;
    if (period === "monthly")
      return `${new Date(year, month - 1, 1).toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      })}`;
    if (rangeStart && rangeEnd) return fmtRange(rangeStart, rangeEnd);
    if (rangeStart) return `From ${rangeStart.toLocaleDateString()}`;
    if (rangeEnd) return `Until ${rangeEnd.toLocaleDateString()}`;
    return "All time";
  }, [period, year, month, quarter, rangeStart, rangeEnd]);

  return (
    <>
      {/* Page */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Finance</h1>
          <div className="flex gap-2">
            <Link to="/finance/add" className="px-3 sm:px-4 py-2 rounded-md border hover:bg-gray-50">
              + Add Transaction
            </Link>
          </div>
        </div>

        {/* Reporting Controls */}
        <div className="rounded-xl border bg-white p-3 sm:p-4 shadow space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium">Report:</label>
            <select
              className="border rounded px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>

            {period === "yearly" && (
              <input
                type="number"
                className="border rounded px-2 py-1 w-24 sm:w-28"
                value={year}
                onChange={(e) => setYear(Number(e.target.value || new Date().getFullYear()))}
              />
            )}

            {period === "quarterly" && (
              <>
                <select
                  className="border rounded px-2 py-1"
                  value={quarter}
                  onChange={(e) => setQuarter(Number(e.target.value))}
                >
                  <option value={1}>Q1</option>
                  <option value={2}>Q2</option>
                  <option value={3}>Q3</option>
                  <option value={4}>Q4</option>
                </select>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-24 sm:w-28"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value || new Date().getFullYear()))}
                />
              </>
            )}

            {period === "monthly" && (
              <>
                <select
                  className="border rounded px-2 py-1"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i, 1).toLocaleString(undefined, { month: "long" })}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-24 sm:w-28"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value || new Date().getFullYear()))}
                />
              </>
            )}

            {period === "custom" && (
              <>
                <label className="text-sm">From</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <label className="text-sm">To</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </>
            )}

            <button
              className="ml-auto px-3 py-1 rounded border hover:bg-gray-50"
              onClick={clearFilters}
              type="button"
            >
              Reset
            </button>
          </div>

          {/* Period nav + label */}
          {period !== "custom" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => shiftPeriod(-1)}
                className="px-3 py-1 rounded border hover:bg-gray-50"
                type="button"
              >
                ← Prev
              </button>
              <div className="text-sm text-gray-700 font-medium">{rangeLabel}</div>
              <button
                onClick={() => shiftPeriod(1)}
                className="px-3 py-1 rounded border hover:bg-gray-50"
                type="button"
              >
                Next →
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-700 font-medium">{rangeLabel}</div>
          )}
        </div>

        {/* Status */}
        {loading && <div>Loading transactions…</div>}
        {!!err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {/* Table (filtered) */}
        {!loading && !err && (
          <div className="rounded-xl border bg-white shadow overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Date</th>
                  <th className="text-left p-3 font-medium text-gray-600">Description</th>
                  <th className="text-right p-3 font-medium text-gray-600">Income</th>
                  <th className="text-right p-3 font-medium text-gray-600">Expense</th>
                  <th className="text-right p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No transactions for this range.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => {
                    const d = toDate(tx.date);
                    const date = d ? d.toLocaleDateString() : tx.date;
                    const inc = Number(tx.income ?? 0).toFixed(2);
                    const exp = Number(tx.expense ?? 0).toFixed(2);
                    return (
                      <tr key={tx.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{date}</td>
                        <td className="p-3">{tx.description || "—"}</td>
                        <td className="p-3 text-right text-green-700">${inc}</td>
                        <td className="p-3 text-right text-red-700">${exp}</td>
                        <td className="p-3 text-right">
                          <Link
                            to={`/finance/${tx.id}`}
                            className="text-blue-600 hover:underline mr-3"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Responsive spacer to reserve footer space (match footer height) */}
        <div className="h-24 lg:h-28" aria-hidden />
      </div>

      {/* Fixed Totals Footer — responsive, centered on mobile, aligned on desktop */}
      <div className="fixed bottom-0 left-0 right-0 h-24 lg:h-28 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md z-50 lg:pl-64">
        <div className="mx-auto max-w-6xl h-full px-4 sm:px-6">
          <div className="flex h-full flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-end">
            <div className="w-full text-center lg:w-auto lg:text-left text-sm sm:text-base text-gray-600">
              Range: <span className="font-semibold text-gray-800">{rangeLabel}</span>
            </div>

            <div className="hidden lg:block ml-auto" />

            <div className="text-sm sm:text-base font-medium">
              Income:{" "}
              <span className="align-middle text-xl sm:text-2xl font-semibold text-green-700">
                ${totals.income}
              </span>
            </div>
            <div className="text-sm sm:text-base font-medium">
              Expense:{" "}
              <span className="align-middle text-xl sm:text-2xl font-semibold text-red-700">
                ${totals.expense}
              </span>
            </div>
            <div className="text-sm sm:text-base font-semibold">
              Balance:{" "}
              <span className="align-middle text-2xl sm:text-3xl font-bold text-gray-900">
                ${totals.balance}
              </span>
            </div>
          </div>
        </div>

        {/* iOS safe area padding for notches/home bar */}
        <div className="pointer-events-none" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
      </div>
    </>
  );
};

export default Finance;
