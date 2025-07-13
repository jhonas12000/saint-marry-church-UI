import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

type FinanceRecord = {
  id: number;
  date: string; // ISO format: "2025-06-01"
  income: number;
  expense: number;
  description: string;
};

type Period = "Monthly" | "Quarterly" | "Yearly";

const mockData: FinanceRecord[] = [
  { id: 1, date: "2025-06-01", income: 500, expense: 0, description: "Member Contributions" },
  { id: 2, date: "2025-06-05", income: 0, expense: 150, description: "Church Supplies" },
  { id: 3, date: "2025-05-20", income: 200, expense: 0, description: "Donation" },
  { id: 4, date: "2025-04-10", income: 0, expense: 100, description: "Maintenance" },
  { id: 5, date: "2025-01-15", income: 1000, expense: 0, description: "Fundraiser" },
  { id: 6, date: "2024-12-01", income: 0, expense: 500, description: "Charity Event" },
];

const Finance = () => {
  const [period, setPeriod] = useState<Period>("Monthly");
  const today = new Date();
  const navigate = useNavigate();

  const filteredData = mockData.filter((record) => {
    const date = parseISO(record.date);
    if (period === "Monthly") {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    } else if (period === "Quarterly") {
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const recordQuarter = Math.floor(date.getMonth() / 3);
      return recordQuarter === currentQuarter && date.getFullYear() === today.getFullYear();
    } else if (period === "Yearly") {
      return date.getFullYear() === today.getFullYear();
    }
    return false;
  });

  const totalIncome = filteredData.reduce((sum, r) => sum + r.income, 0);
  const totalExpense = filteredData.reduce((sum, r) => sum + r.expense, 0);
  const netBalance = totalIncome - totalExpense;

  let runningBalance = 0;

  const handleNewTransactionClick = () => {
    navigate('/finance/add'); // Navigate to the new form route
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Finance</h1>

      <div className="mb-6 text-right">
        <button
          onClick={handleNewTransactionClick}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-lg"
        >
          New Transaction
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="p-2 border rounded"
        >
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Income ($)</th>
              <th className="p-2 border">Expense ($)</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Balance ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => {
              runningBalance += record.income - record.expense;
              return (
                <tr key={record.id} className="border-t">
                  <td className="p-2 border">{format(parseISO(record.date), "yyyy-MM-dd")}</td>
                  <td className="p-2 border">{record.income}</td>
                  <td className="p-2 border">{record.expense}</td>
                  <td className="p-2 border">{record.description}</td>
                  <td className="p-2 border">{runningBalance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Summary ({period})</h2>
        <p><strong>Total Income:</strong> ${totalIncome}</p>
        <p><strong>Total Expense:</strong> ${totalExpense}</p>
        <p><strong>Net Balance:</strong> ${netBalance}</p>
      </div>
    </div>
  );
};

export default Finance;
