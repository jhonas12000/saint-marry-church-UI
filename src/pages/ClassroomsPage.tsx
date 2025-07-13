import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Classroom type
interface Classroom {
  id: number;
  name: string;
  capacity: number;
  // Add other classroom properties if your data model has them
}

// Mock data for classrooms (8 for now, as requested)
const mockClassrooms: Classroom[] = [
  { id: 1, name: "Alpha", capacity: 25 },
  { id: 2, name: "Beta", capacity: 20 },
  { id: 3, name: "Gamma", capacity: 30 },
  { id: 4, name: "Delta", capacity: 22 },
  { id: 5, name: "Epsilon", capacity: 18 },
  { id: 6, name: "Zeta", capacity: 28 },
  { id: 7, name: "Eta", capacity: 20 },
  { id: 8, name: "Theta", capacity: 25 },
];

const ClassroomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- Mock Data Loading ---
    // In a real application, you would fetch classrooms from your backend here.
    // Example: fetch(`${APIBaseURL}/classrooms`, { headers: { Authorization: `Bearer ${getJwtToken()}` }})
    setTimeout(() => { // Simulate API call delay
      setClassrooms(mockClassrooms);
      setLoading(false);
    }, 500); 
    // --- End Mock Data Loading ---
  }, []);

  const handleAddClassroomClick = () => {
    navigate('/education/classrooms/add'); // Navigate to add classroom form
  };

  const handleViewClassroomDetail = (id: number) => {
    navigate(`/education/classrooms/${id}`); // Navigate to classroom detail page
  };

  // Placeholder functions for delete and update
  const handleDeleteClassroom = (id: number) => {
    if (window.confirm(`Are you sure you want to delete Classroom ID: ${id}?`)) {
      console.log(`Delete Classroom with ID: ${id}`);
      // In a real app, call backend API to delete
      setClassrooms(prev => prev.filter(cls => cls.id !== id)); // Optimistic UI update
      alert(`Classroom ID ${id} deleted (mock action).`);
    }
  };

  const handleUpdateClassroom = (id: number) => {
    console.log(`Update Classroom with ID: ${id}`);
    navigate(`/education/classrooms/${id}/edit`); // Navigate to update form
  };
  
  // Navigate back to main Education hub
  const handleBackToEducation = () => {
    navigate('/education');
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading classrooms...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Classrooms</h1>
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackToEducation}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
        >
          Back to Education
        </button>
        <button
          onClick={handleAddClassroomClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-lg"
        >
          Add New Classroom
        </button>
      </div>

      {classrooms.length === 0 ? (
        <p className="text-gray-600 italic text-center">No classrooms found.</p>
      ) : (
        <div className="space-y-4">
          {classrooms.map(classroom => (
            <div key={classroom.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-blue-700" onClick={() => handleViewClassroomDetail(classroom.id)}>
                  {classroom.name} (Capacity: {classroom.capacity})
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateClassroom(classroom.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClassroom(classroom.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassroomsPage;