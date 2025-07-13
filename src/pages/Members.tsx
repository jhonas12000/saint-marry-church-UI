import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import the view components that Members.tsx will now render directly
import MembersListView from "../components/members/MembersListView"; // Adjust path if needed
import MembersTableView from "../pages/MembersTableView"; // Adjust path if needed

const Members: React.FC = () => {
  const navigate = useNavigate();
  // State to manage the currently displayed content view within THIS component
  // Default to 'table' as per your request
  const [currentContentView, setCurrentContentView] = useState<'list' | 'table'>('table'); 

  const handleViewChange = (viewName: 'list' | 'table') => {
    setCurrentContentView(viewName);
    // Optional: If you want the URL to reflect the view even when switching internally, you can use:
    // navigate(`/members/${viewName}`, { replace: true });
  };

  const handleNavigateToFinance = () => {
    navigate("/members/finance-officer"); // Finance view is a separate route/page
  };

  // Handle "Add New Member" button click
  const handleAddMemberClick = () => {
      navigate('/members/add'); // Navigate to the AddMemberForm route
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Main Title for the whole section */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Church Members</h1>

      {/* Navigation buttons to switch between List, Table, and Finance */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => handleViewChange('list')}
          // Style to indicate active view: blue if 'list' is active, hover effect for others
          className={`px-4 py-2 rounded-md transition ${currentContentView === 'list' ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          List View
        </button>
        <button
          onClick={() => handleViewChange('table')}
          // Style to indicate active view: green if 'table' is active, hover effect for others
          className={`px-4 py-2 rounded-md transition ${currentContentView === 'table' ? 'bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          Table View
        </button>
        <button
          onClick={handleNavigateToFinance}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Finance Officer View
        </button>
      </div>

      {/* --- Add New Member Button --- */}
      <div className="mb-6 text-right">
          <button
              onClick={handleAddMemberClick}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-lg"
          >
              Add New Member
          </button>
      </div>
      {/* --- End Add New Member Button --- */}

      {/* --- Conditionally render the selected view's content based on currentContentView state --- */}
      {/* IMPORTANT: These components (MembersListView, MembersTableView) will now NOT have their own titles or buttons */}
      {currentContentView === 'list' && <MembersListView />}
      {currentContentView === 'table' && <MembersTableView />}
    </div>
  );
};

export default Members;