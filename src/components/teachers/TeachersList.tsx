import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Uncomment if needed for update/delete forms

// Define the Teacher type
interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  // Add other teacher properties if your data model has them
}

// Define props for TeachersList
interface TeachersListProps {
  teachers: Teacher[];
  // You'll implement these functions later when connecting to backend
  // onDeleteTeacher: (id: number) => void;
  // onUpdateTeacher: (id: number) => void;
}

const TeachersList: React.FC<TeachersListProps> = ({ teachers /*, onDeleteTeacher, onUpdateTeacher */ }) => {
  // const navigate = useNavigate(); // Uncomment if you use navigate directly here

  // Placeholder functions for delete/update
  const handleDeleteClick = (id: number) => {
    if (window.confirm(`Are you sure you want to delete teacher with ID: ${id}?`)) {
      console.log(`Delete teacher with ID: ${id}`);
      // onDeleteTeacher(id); // Call parent component's delete handler
      alert(`Teacher ID ${id} deleted (mock action).`); // Placeholder
    }
  };

  const handleUpdateClick = (id: number) => {
    console.log(`Update teacher with ID: ${id}`);
    // navigate(`/education/teachers/${id}/edit`); // Navigate to update form (requires new route)
    alert(`Teacher ID ${id} update form will open (mock action).`); // Placeholder
  };

  if (teachers.length === 0) {
    return <p className="text-gray-600 italic">No teachers found for this subject.</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {teachers.map(teacher => (
        <div key={teacher.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
            <p className="text-sm text-gray-600">Email: {teacher.email}</p>
            <p className="text-sm text-gray-600">Phone: {teacher.phone}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdateClick(teacher.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
            >
              Update
            </button>
            <button
              onClick={() => handleDeleteClick(teacher.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeachersList;