// src/pages/TransactionDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, isValid as isValidDate } from "date-fns";
import api from "../api/api"; // <-- use shared client (adds Authorization)

type FinanceRecord = {
  id: number;
  date: string;
  income: number | null;
  expense: number | null;
  description: string;
  personInvolved?: string;
};

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<FinanceRecord | null>(null);
  const [formData, setFormData] = useState<FinanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
  if (!id) {
    console.log("TransactionDetail useEffect, id =", id);
    setLoading(false);
    navigate("/finance", { replace: true });
    return;
  }

  (async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<FinanceRecord>(`/transactions/${id}`);
      setRecord(data);
      setFormData(data);
    } catch (e: any) {
      const s = e?.response?.status;
      setError(
        s === 401
          ? "Unauthorized. Please sign in again."
          : s === 403
          ? "Forbidden. You don’t have access to this transaction."
          : "Transaction not found."
      );
    } finally {
      setLoading(false);
    }
  })();
}, [id, navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "income" || name === "expense"
          ? (value === "" ? null : Number(value))
          : value,
    } as FinanceRecord);
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const { data } = await api.put<FinanceRecord>(
        `/transactions/${formData.id}`,
        formData
      );
      setRecord(data);
      setFormData(data);
      setEditMode(false);
      alert("Transaction updated successfully!");
    } catch (err: any) {
      const status = err?.response?.status;
      alert(
        status === 401
          ? "Unauthorized. Please sign in again."
          : status === 403
          ? "Forbidden."
          : "Failed to update transaction."
      );
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${record.id}`);
      alert("Transaction deleted.");
      navigate("/finance");
    } catch (err: any) {
      const status = err?.response?.status;
      alert(
        status === 401
          ? "Unauthorized. Please sign in again."
          : status === 403
          ? "Forbidden."
          : "Failed to delete transaction."
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !record) return <div className="p-6 text-red-600">{error || "Not found"}</div>;

  const parsed = parseISO(record.date);
  const dateOut = isValidDate(parsed) ? format(parsed, "yyyy-MM-dd") : record.date;
  const income = Number(record.income ?? 0).toFixed(2);
  const expense = Number(record.expense ?? 0).toFixed(2);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Transaction Detail</h1>

      {!editMode && (
        <div className="space-y-2">
          <p><strong>Date:</strong> {dateOut}</p>
          <p><strong>Income:</strong> ${income}</p>
          <p><strong>Expense:</strong> ${expense}</p>
          <p><strong>Description:</strong> {record.description}</p>
          <p><strong>Person Involved (Payer/Receiver):</strong> {record.personInvolved || "—"}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {editMode && formData && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date.slice(0, 10)}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Income</label>
            <input
              type="number"
              name="income"
              value={formData.income ?? ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-medium">Expense</label>
            <input
              type="number"
              name="expense"
              value={formData.expense ?? ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Person Involved (Payer/Receiver)</label>
            <input
              type="text"
              name="personInvolved"
              value={formData.personInvolved ?? ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData(record);
                setEditMode(false);
              }}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
