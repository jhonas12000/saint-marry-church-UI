
import { useEffect, useMemo, useState } from "react";
import { format, parseISO, isValid as isValidDate } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // adjust to "../../api/api" if needed

type FinanceRecord = {
  id: number;
  date: string;         // ISO date, e.g. "2025-08-01"
  income: number | null;
  expense: number | null;
  description: string;
};

type Period = "Monthly" | "Quarterly" | "Yearly" | "Custom";

const Finance = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [period, setPeriod] = useState<Period>("Monthly");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get<FinanceRecord[]>("/transactions");
        setRecords(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (e: any) {
        setError(
          e?.response?.status === 403
            ? "You are not authorized to view financial records."
            : "Failed to load financial records."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const customInvalid =
    period === "Custom" &&
    !!fromDate &&
    !!toDate &&
    new Date(fromDate).getTime() > new Date(toDate).getTime();

  // Filter + sort once, memoized
  const filtered = useMemo(() => {
    if (!records.length) return [];

    const sorted = [...records].sort((a, b) => {
      const da = parseISO(a.date);
      const db = parseISO(b.date);
      return da.getTime() - db.getTime();
    });

    return sorted.filter((r) => {
      const d = parseISO(r.date);
      if (!isValidDate(d)) return false;

      if (period === "Monthly") {
        return (
          d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
        );
      }
      if (period === "Quarterly") {
        const qToday = Math.floor(today.getMonth() / 3);
        const qRec = Math.floor(d.getMonth() / 3);
        return qRec === qToday && d.getFullYear() === today.getFullYear();
      }
      if (period === "Yearly") {
        return d.getFullYear() === today.getFullYear();
      }
      if (period === "Custom" && !customInvalid && fromDate && toDate) {
        const start = parseISO(fromDate);
        const end = parseISO(toDate);
        if (!isValidDate(start) || !isValidDate(end)) return false;
        return d >= start && d <= end;
      }
      return false;
    });
  }, [records, period, fromDate, toDate, today, customInvalid]);

  const { totalIncome, totalExpense, withBalance } = useMemo(() => {
    let running = 0;
    let inc = 0;
    let exp = 0;

    const rows = filtered.map((r) => {
      const income = Number(r.income ?? 0);
      const expense = Number(r.expense ?? 0);
      running += income - expense;
      inc += income;
      exp += expense;
      return { ...r, _balance: running, _income: income, _expense: expense };
    });

    return { totalIncome: inc, totalExpense: exp, withBalance: rows };
  }, [filtered]);

  const netBalance = totalIncome - totalExpense;

  if (loading) return <div className="p-6 text-center">Loading records...</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Finance Dashboard</h1>
        <button
          onClick={() => navigate("/finance/add")}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
        >
          + New Transaction
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-600">Filter by</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="border p-2 rounded w-full"
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {period === "Custom" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </>
        )}
      </div>

      {customInvalid && (
        <p className="text-red-500 font-medium">
          “From” date must be before or same as “To” date.
        </p>
      )}

      {!customInvalid && (
        <>
          <div className="overflow-x-auto border rounded-lg shadow bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-right">Income</th>
                  <th className="p-3 text-right">Expense</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Balance</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {withBalance.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {isValidDate(parseISO(r.date))
                        ? format(parseISO(r.date), "yyyy-MM-dd")
                        : r.date}
                    </td>
                    <td className="p-3 text-right text-green-600 font-semibold">
                      ${r._income.toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-red-600 font-semibold">
                      ${r._expense.toFixed(2)}
                    </td>
                    <td className="p-3">{r.description}</td>
                    <td className="p-3 text-right">
                      ${r._balance.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/finance/${r.id}`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {withBalance.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan={6}>
                      No transactions for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="w-full max-w-md bg-gray-100 rounded-lg shadow p-4 mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Summary ({period}
              {period === "Custom" && fromDate && toDate ? `: ${fromDate} → ${toDate}` : ""})
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Total Income:</strong> ${totalIncome.toFixed(2)}
              </p>
              <p>
                <strong>Total Expense:</strong> ${totalExpense.toFixed(2)}
              </p>
              <p>
                <strong>Net Balance:</strong> ${netBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Finance;
