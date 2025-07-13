import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Type definition for form data
interface ClassroomFormData {
    id?: number; // Optional for new classroom
    name: string;
    capacity: number | '';
}

const AddClassroomForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get ID from URL if in edit mode
    const [formData, setFormData] = useState<ClassroomFormData>({
        name: '',
        capacity: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Effect to load data if in edit mode
    useEffect(() => {
        if (id) {
            // --- Mock Data Loading for Edit Mode ---
            // In a real app, you'd fetch the classroom by ID from backend here.
            const mockClassrooms = [
                { id: 1, name: "Alpha", capacity: 25 },
                { id: 2, name: "Beta", capacity: 20 },
                // ... (add more mock classrooms if needed for testing edit)
            ];
            const existingClassroom = mockClassrooms.find(cls => cls.id === Number(id));
            if (existingClassroom) {
                setFormData(existingClassroom);
            } else {
                setSubmitStatus("Error: Classroom not found for editing.");
            }
            // --- End Mock Data Loading ---
        }
    }, [id]); // Depend on ID from URL

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'capacity' ? (value === '' ? '' : Number(value)) : value 
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Classroom Name is required.";
        if (formData.capacity === '' || isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
            newErrors.capacity = "Capacity must be a positive number.";
        }

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

        setLoading(true);
        console.log("Classroom Form Data Submitted:", formData);
        setSubmitStatus(`Classroom ${id ? 'updated' : 'added'} successfully! (No API call yet)`); // Placeholder
        
        // --- TODO: API Integration will go here ---
        // try {
        //   const method = id ? 'PUT' : 'POST';
        //   const url = id ? `${APIBaseURL}/classrooms/${id}` : `${APIBaseURL}/classrooms`;
        //   const response = await fetch(url, {
        //     method: method,
        //     headers: { "Content-Type": "application/json", /* "Authorization": `Bearer ${getJwtToken()}` */ },
        //     body: JSON.stringify(formData),
        //   });
        //   if (response.ok) {
        //     setSubmitStatus(`Classroom ${id ? 'updated' : 'added'} successfully!`);
        //     navigate('/education/classrooms'); // Redirect back to list
        //   } else {
        //     const errorData = await response.json();
        //     setSubmitStatus(`Error: ${errorData.message || 'Failed to save classroom.'}`);
        //   }
        // } catch (err: any) {
        //   setSubmitStatus(`Network error: ${err.message}`);
        // } finally {
        //   setLoading(false);
        // }
        // --- END TODO ---

        setLoading(false);
        navigate('/education/classrooms'); // Go back to the classrooms list
    };

    const handleCancel = () => {
        navigate('/education/classrooms'); // Go back to the classrooms list
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {id ? 'Update Classroom' : 'Add New Classroom'}
            </h1>

            {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {submitStatus}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Classroom Name:</label>
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
                <div className="mb-6">
                    <label htmlFor="capacity" className="block text-gray-700 text-sm font-bold mb-2">Capacity:</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.capacity ? 'border-red-500' : ''}`}
                        min="1"
                        required
                    />
                    {errors.capacity && <p className="text-red-500 text-xs italic">{errors.capacity}</p>}
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
                        {loading ? 'Saving...' : (id ? 'Update Classroom' : 'Save Classroom')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClassroomForm;