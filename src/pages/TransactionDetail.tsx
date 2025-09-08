import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

type FinanceRecord = {
  id: number;
  date: string;
  income: number;
  expense: number;
  description: string;
  personInvolved: string;  // new field for payer/receiver
};

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<FinanceRecord | null>(null);
  const [formData, setFormData] = useState<FinanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get<FinanceRecord>(`http://localhost:8080/api/transactions/${id}`)
      .then(res => {
        setRecord(res.data);
        setFormData(res.data);
        setError('');
      })
      .catch(() => setError('Transaction not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'income' || name === 'expense'
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      const res = await axios.put<FinanceRecord>(
        `http://localhost:8080/api/transactions/${formData.id}`,
        formData
      );
      setRecord(res.data);
      setEditMode(false);
      alert('Transaction updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update transaction.');
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${record.id}`);
      alert('Transaction deleted.');
      navigate('/finance');
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !record) return <div className="p-6 text-red-600">{error || 'Not found'}</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Transaction Detail</h1>

      {!editMode && (
        <div className="space-y-2">
          <p><strong>Date:</strong> {format(parseISO(record.date), 'yyyy-MM-dd')}</p>
          <p><strong>Income:</strong> ${record.income}</p>
          <p><strong>Expense:</strong> ${record.expense}</p>
          <p><strong>Description:</strong> {record.description}</p>
          <p><strong>Person Involved (Payer/Receiver):</strong> {record.personInvolved}</p>
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
              value={formData.income}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Expense</label>
            <input
              type="number"
              name="expense"
              value={formData.expense}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
              value={formData.personInvolved}
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
