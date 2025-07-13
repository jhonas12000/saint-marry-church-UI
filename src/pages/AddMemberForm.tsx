import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

// Type definitions (can be expanded later)
interface Child {
    name: string;
    birthDate: string; // YYYY-MM-DD format
    gender: string;
}

interface MemberFormData { // Renamed from ParentFormData
    firstName: string;
    lastName: string;
    telephone: string;
    email: string;
    address: string; // Assuming 'city/address' means a single address field
    spouseFirstName: string;
    spouseLastName: string;
    spouseTelephone: string;
    children: Child[];
    monthlyPayment?: number;               // ✅ Required
    medhaneAlemPledge?: number;           // ✅ Optiona
}

const AddMemberForm: React.FC = () => { // Renamed component
    const navigate = useNavigate();
    const [formData, setFormData] = useState<MemberFormData>({ // Renamed formData type
        firstName: '',
        lastName: '',
        telephone: '',
        email: '',
        address: '',
        spouseFirstName: '', 
        spouseLastName: '', 
        spouseTelephone: '', 
        children: [],
        monthlyPayment: undefined,
        medhaneAlemPledge: undefined,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);

    const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleChildChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedChildren = formData.children.map((child, i) =>
            i === index ? { ...child, [name]: value } : child
        );
        setFormData(prev => ({ ...prev, children: updatedChildren }));
    };

    const handleAddChild = () => {
        setFormData(prev => ({
            ...prev,
            children: [...prev.children, { name: '', birthDate: '', gender: '' }]
        }));
    };

    const handleRemoveChild = (index: number) => {
        setFormData(prev => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = "First Name is required.";
        if (!formData.lastName) newErrors.lastName = "Last Name is required.";
        if (!formData.telephone) newErrors.telephone = "Telephone is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!formData.address) newErrors.address = "Address is required.";

        formData.children.forEach((child, index) => {
            if (!child.name) newErrors[`childName${index}`] = "Child's Name is required.";
            if (!child.birthDate) newErrors[`childBirthDate${index}`] = "Child's Birthdate is required.";
            if (!child.gender) newErrors[`childGender${index}`] = "Child's Gender is required.";
        });

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

  try {
    const response = await api.post('/church-members', formData);
    console.log(response.data)
    setSubmitStatus("✅ Member added successfully!");
    setTimeout(() => navigate('/members'), 1500);
  } catch (error: any) {
    const message = error.response?.data || " Failed to add member.";
    setSubmitStatus(message);
  }
};

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Member & Children</h1> {/* Updated title */}

            {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {submitStatus}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Member Information</h2> {/* Updated title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">Telephone:</label>
                        <input
                            type="tel"
                            id="telephone"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.telephone ? 'border-red-500' : ''}`}
                        />
                        {errors.telephone && <p className="text-red-500 text-xs italic">{errors.telephone}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address (City/State):</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
                        />
                        {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Spouse Information (Optional)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="spouseFirstName" className="block text-gray-700 text-sm font-bold mb-2">Spouse First Name:</label>
                        <input
                            type="text"
                            id="spouseFirstName"
                            name="spouseFirstName"
                            value={formData.spouseFirstName}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.spouseFirstName ? 'border-red-500' : ''}`}
                            // removed 'required' as it's optional
                        />
                        {errors.spouseFirstName && <p className="text-red-500 text-xs italic">{errors.spouseFirstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="spouseLastName" className="block text-gray-700 text-sm font-bold mb-2">Spouse Last Name:</label>
                        <input
                            type="text"
                            id="spouseLastName"
                            name="spouseLastName"
                            value={formData.spouseLastName}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.spouseLastName ? 'border-red-500' : ''}`}
                            // removed 'required' as it's optional
                        />
                        {errors.spouseLastName && <p className="text-red-500 text-xs italic">{errors.spouseLastName}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="spouseTelephone" className="block text-gray-700 text-sm font-bold mb-2">Spouse Telephone:</label>
                        <input
                            type="tel"
                            id="spouseTelephone"
                            name="spouseTelephone"
                            value={formData.spouseTelephone}
                            onChange={handleParentChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.spouseTelephone ? 'border-red-500' : ''}`}
                            // removed 'required' as it's optional
                        />
                        {errors.spouseTelephone && <p className="text-red-500 text-xs italic">{errors.spouseTelephone}</p>}
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="monthlyPayment" className="block text-gray-700 text-sm font-bold mb-2">
                            Monthly Membership Payment:
                        </label>
                        <input
                            type="number"
                            id="monthlyPayment"
                            name="monthlyPayment"
                            value={formData.monthlyPayment}
                            onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                monthlyPayment: Number(e.target.value),
                            }))
                            }
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.monthlyPayment ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.monthlyPayment && (
                            <p className="text-red-500 text-xs italic">{errors.monthlyPayment}</p>
                        )}
                        </div>

                        <div className="col-span-full">
                        <label htmlFor="medhaneAlemPledge" className="block text-gray-700 text-sm font-bold mb-2">
                            Medhane Alem Payment <span className="text-gray-500">(Optional)</span>:
                        </label>
                        <input
                            type="number"
                            id="medhaneAlemPledge"
                            name="medhaneAlemPledge"
                            value={formData.medhaneAlemPledge ?? ''}
                            onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                medhaneAlemPledge: e.target.value ? Number(e.target.value) : undefined,
                            }))
                            }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        </div>

                </div>

                <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Children Information</h2>
                {formData.children.map((child, index) => (
                    <div key={index} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Child #{index + 1}</h3>
                        <button
                            type="button"
                            onClick={() => handleRemoveChild(index)}
                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold"
                        >
                            &times; Remove
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={`childName${index}`} className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                <input
                                    type="text"
                                    id={`childName${index}`}
                                    name="name"
                                    value={child.name}
                                    onChange={(e) => handleChildChange(index, e)}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[`childName${index}`] ? 'border-red-500' : ''}`}
                                />
                                {errors[`childName${index}`] && <p className="text-red-500 text-xs italic">{errors[`childName${index}`]}</p>}
                            </div>
                            <div>
                                <label htmlFor={`childBirthDate${index}`} className="block text-gray-700 text-sm font-bold mb-2">Birthdate:</label>
                                <input
                                    type="date"
                                    id={`childBirthDate${index}`}
                                    name="birthDate"
                                    value={child.birthDate}
                                    onChange={(e) => handleChildChange(index, e)}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[`childBirthDate${index}`] ? 'border-red-500' : ''}`}
                                />
                                {errors[`childBirthDate${index}`] && <p className="text-red-500 text-xs italic">{errors[`childBirthDate${index}`]}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor={`childGender${index}`} className="block text-gray-700 text-sm font-bold mb-2">Gender:</label>
                                <select
                                    id={`childGender${index}`}
                                    name="gender"
                                    value={child.gender}
                                    onChange={(e) => handleChildChange(index, e)}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[`childGender${index}`] ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors[`childGender${index}`] && <p className="text-red-500 text-xs italic">{errors[`childGender${index}`]}</p>}
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddChild}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mb-6"
                >
                    Add Child
                </button>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/members/list')} // Back button
                        className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
                    >
                        Save Member
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMemberForm;