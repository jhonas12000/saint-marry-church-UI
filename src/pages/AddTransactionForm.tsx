import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions for form data
interface TransactionFormData {
    date: string; // YYYY-MM-DD
    income: number | ''; // Use '' for initial empty state to avoid 0
    expense: number | ''; // Use '' for initial empty state
    description: string;
    personInvolved: string; // "Person who receives the money or make a payment"
}

const AddTransactionForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TransactionFormData>({
        date: '',
        income: '',
        expense: '',
        description: '',
        personInvolved: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({}); // For form validation errors
    const [submitStatus, setSubmitStatus] = useState<string | null>(null); // For success/error messages after submit

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: (name === 'income' || name === 'expense') ? (value === '' ? '' : Number(value)) : value 
        }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.date) newErrors.date = "Date is required.";
        if (formData.income === '' && formData.expense === '') {
            newErrors.income = "Either Income or Expense is required.";
            newErrors.expense = "Either Income or Expense is required.";
        }
        if (formData.income && (isNaN(Number(formData.income)) || Number(formData.income) < 0)) newErrors.income = "Income must be a non-negative number.";
        if (formData.expense && (isNaN(Number(formData.expense)) || Number(formData.expense) < 0)) newErrors.expense = "Expense must be a non-negative number.";
        if (!formData.description) newErrors.description = "Description is required.";
        if (!formData.personInvolved) newErrors.personInvolved = "Person involved is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus(null);
        if (!validateForm()) {
            setSubmitStatus("Please fix the errors in the form.");
            return;
        }

        console.log("Form Data Submitted:", formData);
        setSubmitStatus("Transaction submitted successfully! (No API call yet)"); // Placeholder for API success
        // navigate('/finance'); // Redirect after successful submission (uncomment when API is integrated)
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Record New Transaction</h1>

            {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {submitStatus}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="col-span-full">
                        <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
                    </div>
                    <div>
                        <label htmlFor="income" className="block text-gray-700 text-sm font-bold mb-2">Income ($):</label>
                        <input
                            type="number"
                            id="income"
                            name="income"
                            value={formData.income}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.income ? 'border-red-500' : ''}`}
                            min="0"
                            step="0.01"
                        />
                        {errors.income && <p className="text-red-500 text-xs italic">{errors.income}</p>}
                    </div>
                    <div>
                        <label htmlFor="expense" className="block text-gray-700 text-sm font-bold mb-2">Expense ($):</label>
                        <input
                            type="number"
                            id="expense"
                            name="expense"
                            value={formData.expense}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.expense ? 'border-red-500' : ''}`}
                            min="0"
                            step="0.01"
                        />
                        {errors.expense && <p className="text-red-500 text-xs italic">{errors.expense}</p>}
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
                            required
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="personInvolved" className="block text-gray-700 text-sm font-bold mb-2">Person Involved (Payer/Receiver):</label>
                        <input
                            type="text"
                            id="personInvolved"
                            name="personInvolved"
                            value={formData.personInvolved}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.personInvolved ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.personInvolved && <p className="text-red-500 text-xs italic">{errors.personInvolved}</p>}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/finance')} // Back button
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        Save Transaction
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTransactionForm;