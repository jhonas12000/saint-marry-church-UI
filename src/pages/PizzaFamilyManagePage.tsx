import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { formatYMDForDisplay, todayLocalYMD } from "../utils/date";

type Contribution = {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  amount: number;
  paymentDate: string; // yyyy-mm-dd
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>{children}</div>
);

function currency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const PizzaFamilyManagePage: React.FC = () => {
  const { telephone = "" } = useParams<{ telephone: string }>();
  const tel = decodeURIComponent(telephone);
  const navigate = useNavigate();

  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // --- Record Payment form state ---
  const [recFirstName, setRecFirstName] = useState("");
  const [recLastName, setRecLastName] = useState("");
  const [recTelephone, setRecTelephone] = useState(tel);
  const [recAmount, setRecAmount] = useState<string>("100");
  const [recDate, setRecDate] = useState<string>(() => todayLocalYMD());
  const [recNumber, setRecNumber] = useState<number>(1); // 1..4
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      // If baseURL already has "/api", keep this path without "/api"
      const { data } = await api.get<Contribution[]>(
        `/pizza-contributions/by-telephone/${encodeURIComponent(tel)}`
      );
      setItems(data);

      // Prefill names from first record if present
      if (data.length > 0) {
        setRecFirstName(data[0].firstName ?? "");
        setRecLastName(data[0].lastName ?? "");
      }
      // Suggest next payment number (cap at 4)
      const suggested = Math.min((data.length || 0) + 1, 4);
      setRecNumber(suggested);

      // Keep telephone aligned
      setRecTelephone(tel);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load contributions for this family.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tel]);

  const familyName = useMemo(() => {
    if (items.length === 0) return "";
    const { firstName, lastName } = items[0];
    return `${firstName ?? ""} ${lastName ?? ""}`.trim();
  }, [items]);

  async function onDelete(id: number) {
    if (!confirm("Delete this contribution?")) return;
    try {
      await api.delete(`/pizza-contributions/${id}`);
      setNotice("Deleted.");
      await refresh();
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to delete.");
    }
  }

  async function onDeleteAll() {
    if (!confirm("Delete ALL contributions for this family? This cannot be undone.")) return;
    try {
      for (const c of items) {
        await api.delete(`/pizza-contributions/${c.id}`);
      }
      setNotice("All contributions deleted.");
      await refresh();
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to delete all.");
    }
  }

  // ---- Record Payment (1st–4th) ----
  async function onRecordPayment(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setNotice(null);

    const amtNum = parseFloat(recAmount);
    if (!recFirstName.trim() || !recLastName.trim()) {
      setErr("First and last name are required.");
      return;
    }
    if (!recTelephone.trim()) {
      setErr("Telephone is required.");
      return;
    }
    if (!recDate) {
      setErr("Payment date is required.");
      return;
    }
    if (Number.isNaN(amtNum) || amtNum <= 0) {
      setErr("Amount must be a positive number.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        firstName: recFirstName.trim(),
        lastName: recLastName.trim(),
        telephone: recTelephone.trim(),
        amount: amtNum,
        paymentDate: recDate, // yyyy-mm-dd
      };
      await api.post(`/pizza-contributions`, payload);
      setNotice(`${["1st", "2nd", "3rd", "4th"][recNumber - 1]} payment recorded.`);
      // Reset amount/date for convenience; keep names/telephone
      setRecAmount("100");
      setRecDate(todayLocalYMD());
      await refresh();
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to record payment.");
    } finally {
      setSaving(false);
    }
  }

  const total = useMemo(() => items.reduce((s, x) => s + (x.amount ?? 0), 0), [items]);

  const suggestedOrdinal = ordinal(Math.min((items.length || 0) + 1, 4));
  const maxed = (items.length || 0) + 1 > 4;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 rounded-xl border" onClick={() => navigate("/pizza-family")}>← Back</button>
        <h1 className="text-2xl font-bold">Manage Family</h1>
        <div className="ml-auto flex gap-2">
          <Link
            to={`/pizza-family/add?telephone=${encodeURIComponent(tel)}&firstName=${encodeURIComponent(familyName.split(" ")[0] || "")}&lastName=${encodeURIComponent(familyName.split(" ")[1] || "")}`}
            className="px-4 py-2 rounded-2xl shadow text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Contribution
          </Link>
          <button className="px-4 py-2 rounded-2xl shadow text-white bg-red-600 hover:bg-red-700" onClick={onDeleteAll}>
            Delete All
          </button>
        </div>
      </div>

      {notice && <div className="rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-2">{notice}</div>}
      {err && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2">{err}</div>}

      {/* Record Payment (1st–4th) */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Record Payment (1st–4th)</h2>
        <form onSubmit={onRecordPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="recNumber" className="block text-sm font-medium text-gray-700 mb-1">Payment No.</label>
            <select
              id="recNumber"
              className="w-full border rounded-xl px-3 py-2"
              value={recNumber}
              onChange={(e) => setRecNumber(parseInt(e.target.value, 10))}
            >
              <option value={1}>1st</option>
              <option value={2}>2nd</option>
              <option value={3}>3rd</option>
              <option value={4}>4th</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Suggestion: {suggestedOrdinal}{maxed ? " (maxed)" : ""}
            </div>
          </div>

          <div>
            <label htmlFor="recAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
            <input
              id="recAmount"
              type="number"
              step="0.01"
              min="0"
              className="w-full border rounded-xl px-3 py-2"
              value={recAmount}
              onChange={(e) => setRecAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="recDate" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              id="recDate"
              type="date"
              className="w-full border rounded-xl px-3 py-2"
              value={recDate}
              onChange={(e) => setRecDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-2xl shadow text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Record Payment"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-2xl shadow border"
              onClick={() => {
                setRecAmount("100");
                setRecDate(todayLocalYMD());
                setErr(null);
                setNotice(null);
              }}
            >
              Reset
            </button>
          </div>

          {/* Names & Telephone (prefilled) */}
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="recFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="recFirstName"
                className="w-full border rounded-xl px-3 py-2"
                value={recFirstName}
                onChange={(e) => setRecFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="recLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="recLastName"
                className="w-full border rounded-xl px-3 py-2"
                value={recLastName}
                onChange={(e) => setRecLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="recTelephone" className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
              <input
                id="recTelephone"
                className="w-full border rounded-xl px-3 py-2"
                value={recTelephone}
                onChange={(e) => setRecTelephone(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Contributions with Edit/Delete */}
      <Card>
        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No contributions yet.</div>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-600">
              Family: <b>{familyName || "(unknown)"}</b> • Tel: <b>{tel}</b> • Total: <b>{currency(total)}</b>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Payment Date</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...items] // copy to avoid mutating state
                    .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)) // safe string sort
                    .map((c) => (
                      <tr key={c.id} className="border-b last:border-b-0">
                        <td className="py-2 pr-4">{currency(Number(c.amount))}</td>
                        <td className="py-2 pr-4">{formatYMDForDisplay(c.paymentDate)}</td>
                        <td className="py-2 pr-4 flex gap-2">
                          <Link
                            to={`/pizza-family/edit/${c.id}`}
                            className="px-3 py-1.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Edit
                          </Link>
                          <button
                            className="px-3 py-1.5 rounded-xl text-white bg-red-600 hover:bg-red-700"
                            onClick={() => onDelete(c.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PizzaFamilyManagePage;
