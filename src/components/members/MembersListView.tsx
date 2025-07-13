import React from 'react';
import { useNavigate } from 'react-router-dom'; 

// Member type (consistent with MembersTableView)
type Member = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  monthlyPayment?: string;
};

// Mock data (consistent with MembersTableView)
const mockMembers: Member[] = [
  { id: 1, firstName: "Yonas", lastName: "Weldemichael", fullName: "Yonas Weldemichael", phone: "(510) 123-4567", email: "yonas@example.com" },
  { id: 2, firstName: "Ruth", lastName: "Abraham", fullName: "Ruth Abraham", phone: "(408) 765-4321", email: "ruth@example.com" },
  { id: 3, firstName: "Michael", lastName: "Solomon", fullName: "Michael Solomon", phone: "(650) 987-6543", email: "michael@example.com", address: "San Francisco, CA", monthlyPayment: "$60" },
];

const MembersListView: React.FC = () => {
    const navigate = useNavigate();
    const members = mockMembers; 

    // Function to handle viewing member profile
    const handleViewProfile = (id: number) => {
        navigate(`/members/${id}`);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            {/* REMOVED: h1 title for this specific view - the main title is in Members.tsx */}
            {/* REMOVED: Navigation buttons - these belong ONLY in Members.tsx */}

            {members.length === 0 ? (
                <p className="text-gray-600">No members found in mock data.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map(member => (
                        <div key={member.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => handleViewProfile(member.id)}>
                            <h3 className="font-semibold text-lg text-gray-800">{member.firstName} {member.lastName}</h3>
                            <p className="text-gray-600 text-sm"><span className="font-medium">Email:</span> {member.email}</p>
                            <p className="text-gray-600 text-sm"><span className="font-medium">Phone:</span> {member.phone}</p>
                            <button onClick={(e) => { e.stopPropagation(); handleViewProfile(member.id); }} className="mt-2 text-blue-600 hover:underline text-sm">View Profile</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MembersListView;