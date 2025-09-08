import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // if baseURL has /api already, change POST path below to "/pizza-contributions"

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

const PizzaFamilyAddPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [telephone, setTelephone]   = useState("");
  const [amount, setAmount]         = useState<string>("100");
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const amtNum = parseFloat(amount);
    if (!firstName.trim() || !lastName.trim()) { setErr("First and last name are required."); return; }
    if (!telephone.trim()) { setErr("Telephone is required."); return; }
    if (!paymentDate) { setErr("Payment date is required."); return; }
    if (Number.isNaN(amtNum) || amtNum <= 0) { setErr("Amount must be a positive number."); return; }

    try {
      setSaving(true);

      const payload: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        telephone: telephone.trim(),
        amount: amtNum,
        paymentDate,
      };
      // If your backend accepts email for contributions, include it:
      // if (email.trim()) payload.email = email.trim();

      // If baseURL ALREADY has "/api", use "/pizza-contributions" instead:
      await api.post("/pizza-contributions", payload);

      navigate("/pizza-family", { state: { message: "Contribution added successfully." } });
    } catch (e: any) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to save contribution.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Add Pizza Family Contribution</h1>
        <div className="ml-auto">
          <button
            className="px-4 py-2 rounded-2xl shadow border"
            onClick={() => navigate("/pizza-family")}
            type="button"
          >
            Back to List
          </button>
        </div>
      </div>

      <Card>
        {err && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-2">{err}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldWrap>
            <InputLabel htmlFor="firstName" label="First Name" />
            <input id="firstName" className="w-full border rounded-xl px-3 py-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </FieldWrap>

          <FieldWrap>
            <InputLabel htmlFor="lastName" label="Last Name" />
            <input id="lastName" className="w-full border rounded-xl px-3 py-2" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </FieldWrap>

          <FieldWrap>
            <InputLabel htmlFor="email" label="Email (optional)" />
            <input id="email" type="email" className="w-full border rounded-xl px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="family@example.com" />
          </FieldWrap>

          <FieldWrap>
            <InputLabel htmlFor="telephone" label="Telephone" />
            <input id="telephone" className="w-full border rounded-xl px-3 py-2" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          </FieldWrap>

          <FieldWrap>
            <InputLabel htmlFor="amount" label="Amount (USD)" />
            <input id="amount" type="number" step="0.01" min="0" className="w-full border rounded-xl px-3 py-2" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </FieldWrap>

          <FieldWrap>
            <InputLabel htmlFor="paymentDate" label="Payment Date" />
            <input id="paymentDate" type="date" className="w-full border rounded-xl px-3 py-2" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
          </FieldWrap>

          <div className="flex items-end gap-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <button
              type="button"
              className="px-4 py-2 rounded-2xl shadow border"
              onClick={() => {
                setFirstName(""); setLastName(""); setEmail(""); setTelephone("");
                setAmount("100"); setPaymentDate(new Date().toISOString().slice(0, 10)); setErr(null);
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PizzaFamilyAddPage;
