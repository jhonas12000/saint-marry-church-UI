// src/pages/PizzaContributionEditPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api"; // If baseURL already includes /api, drop /api from paths below

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

const InputLabel: React.FC<{ label: string; htmlFor: string; }> = ({ label, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
);

const FieldWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-2xl shadow text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const PizzaContributionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Contribution | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Contribution>(`/api/pizza-contributions/${id}`);
        setForm({
          ...data,
          paymentDate: data.paymentDate.slice(0, 10), // ensure yyyy-mm-dd for <input type="date">
        });
      } catch (e: any) {
        console.error(e);
        setErr(e?.response?.data?.message || "Failed to load contribution.");
      }
    })();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErr(null);
    try {
      setSaving(true);
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        telephone: form.telephone.trim(),
        amount: Number(form.amount),
        paymentDate: form.paymentDate, // yyyy-mm-dd
      };
      await api.put(`/pizza-contributions/${form.id}`, payload);
      // After save, go back to family manage view
      navigate(`/pizza-family/manage/${encodeURIComponent(form.telephone)}`);
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to save contribution.");
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return (
      <div className="p-6">
        <button className="px-3 py-1.5 rounded-xl border mb-4" onClick={() => navigate(-1)}>← Back</button>
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <button className="px-3 py-1.5 rounded-xl border" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="text-2xl font-bold ml-3">Edit Contribution</h1>
      </div>

      <Card>
        {err && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2">{err}</div>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldWrap>
            <InputLabel htmlFor="firstName" label="First Name" />
            <input id="firstName" className="w-full border rounded-xl px-3 py-2" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </FieldWrap>
          <FieldWrap>
            <InputLabel htmlFor="lastName" label="Last Name" />
            <input id="lastName" className="w-full border rounded-xl px-3 py-2" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </FieldWrap>
          <FieldWrap>
            <InputLabel htmlFor="telephone" label="Telephone" />
            <input id="telephone" className="w-full border rounded-xl px-3 py-2" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} required />
          </FieldWrap>
          <FieldWrap>
            <InputLabel htmlFor="amount" label="Amount (USD)" />
            <input id="amount" type="number" step="0.01" min="0" className="w-full border rounded-xl px-3 py-2" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} required />
          </FieldWrap>
          <FieldWrap>
            <InputLabel htmlFor="paymentDate" label="Payment Date" />
            <input id="paymentDate" type="date" className="w-full border rounded-xl px-3 py-2" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} required />
          </FieldWrap>

          <div className="flex items-end gap-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <button type="button" className="px-4 py-2 rounded-2xl shadow border" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PizzaContributionEditPage;
