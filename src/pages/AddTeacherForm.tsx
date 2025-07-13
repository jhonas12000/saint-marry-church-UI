import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions for form data
interface TeacherFormData {
    name: string;
    email: string;
    phone: string;
}

const AddTeacherForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TeacherFormData>({
        name: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({}); // For form validation errors
    const [submitStatus, setSubmitStatus] = useState<string | null>(null); // For success/error messages after submit
    const [loading, setLoading] = useState(false); // For submit button loading state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Teacher Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

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

        setLoading(true); // Start loading

        console.log("Teacher Form Data Submitted (UI Only):", formData);
        setSubmitStatus("Teacher added successfully! (API integration coming later)"); // Placeholder success
        
        // --- TODO: API Integration will go here ---
        // try {
        //   const response = await fetch("YOUR_BACKEND_API_ENDPOINT_TO_ADD_TEACHER", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       // "Authorization": `Bearer ${getJwtToken()}` // If protected
        //     },
        //     body: JSON.stringify(formData),
        //   });
        //   if (response.ok) {
        //     setSubmitStatus("Teacher added successfully!");
        //     // Optionally clear form: setFormData({ name: '', email: '', phone: '' });
        //     // navigate('/education/bible-study/teachers'); // Redirect back to teachers list
        //   } else {
        //     const errorData = await response.json();
        //     setSubmitStatus(`Error: ${errorData.message || 'Failed to add teacher.'}`);
        //   }
        // } catch (err: any) {
        //   setSubmitStatus(`Network error: ${err.message}`);
        // } finally {
        //   setLoading(false);
        // }
        // --- END TODO ---

        setLoading(false); // Stop loading after mock submission
        // For now, redirect immediately after showing mock status
        navigate(-1); // Go back to the previous page (teacher list)
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page (teacher list)
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Teacher</h1>

            {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {submitStatus}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Teacher Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Teacher'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacherForm;