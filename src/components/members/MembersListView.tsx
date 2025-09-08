// src/components/members/MembersListView.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/api";
import axios from 'axios';

type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  address?: string;
  monthlyPayment?: number;
  medhaneAlemPledge?: number;
};

interface MembersListViewProps {
  members: Member[];
  refreshMembers: () => void;
}

const MembersListView: React.FC<MembersListViewProps> = ({ members, refreshMembers }) => {
  const navigate = useNavigate();

  const handleViewProfile = (id: number) => {
    // debug log (optional)
    console.log('Navigating to member profile:', id);
    navigate(`/members/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
     await api.delete(`/church-members/${id}`);
      alert("✅ Member deleted successfully!");
      refreshMembers();
    } catch (error) {
      console.error("Failed to delete member", error);
      alert("❌ Failed to delete member.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {members.length === 0 ? (
        <p className="text-gray-600">No members found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer relative"
              onClick={() => handleViewProfile(member.id)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Email:</span> {member.email}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Phone:</span> {member.telephone}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(member.id);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(member.id);
                  }}
                  className="text-red-600 hover:underline text-sm"
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

export default MembersListView;
