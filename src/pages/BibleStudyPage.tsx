import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeachersList from '../components/teachers/TeachersList'; // We will create this component

const BibleStudyPage: React.FC = () => {
    const navigate = useNavigate();

    // --- Mock data for Bible Study Teachers (for UI development) ---
    const bibleStudyTeachers = [
        { id: 101, name: "Mr. David", email: "david@example.com", phone: "111-222-3333" },
        { id: 102, name: "Ms. Sarah", email: "sarah@example.com", phone: "444-555-6666" },
    ];
    // --- End Mock Data ---

    const handleAddTeacherClick = () => {
        navigate('/education/bible-study/teachers/add'); // Navigate to add teacher form
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Bible Study</h1>
            <p className="text-gray-600 mb-4 text-center">Manage teachers and classrooms for Bible Study.</p>

            <div className="flex flex-wrap gap-4 mb-6 justify-center">
                <button
                    onClick={() => navigate('/education')}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                    Back to Education
                </button>
                <button
                    onClick={() => navigate('/education/bible-study/classrooms')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    View Classrooms
                </button>
            </div>

            {/* --- Teacher Management Section --- */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Teachers</h2>
                    <button
                        onClick={handleAddTeacherClick}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm"
                    >
                        Add A Teacher
                    </button>
                </div>
                {/* Render TeachersList component with mock data */}
                <TeachersList teachers={bibleStudyTeachers} /> 
            </div>
            {/* --- End Teacher Management Section --- */}
        </div>
    );
};

export default BibleStudyPage;