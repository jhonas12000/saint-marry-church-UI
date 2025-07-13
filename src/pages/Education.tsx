import React from 'react'; // Keep React import
import { useNavigate } from 'react-router-dom'; // Add this import

const Education: React.FC = () => { // Add React.FC type for consistency
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Education Department</h1>
      <p className="text-gray-600 mb-8 text-center">Explore different areas of our educational programs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bible Study Button */}
        <button
          onClick={() => handleNavigate('/education/bible-study')}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          <span className="mb-2 text-3xl">📚</span>
          Bible Study
        </button>

        {/* Tigrigna Study Button */}
        <button
          onClick={() => handleNavigate('/education/tigrigna-study')}
          className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold"
        >
          <span className="mb-2 text-3xl">🗣️</span>
          Tigrigna Study
        </button>

        {/* Classrooms Button */}
        <button
          onClick={() => handleNavigate('/education/classrooms')}
          className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
        >
          <span className="mb-2 text-3xl">🏫</span>
          Classrooms
        </button>
      </div>

    </div>
  );
};

export default Education;