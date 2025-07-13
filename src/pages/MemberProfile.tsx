import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Child = {
  name: string;
  gender: string;
  age: number;
};

type Member = {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  monthlyPayment: string;
  spouse: string;
  children: Child[];
};

const mockMembers: Member[] = [
  {
    id: 1,
    fullName: "Yonas Weldemichael",
    phone: "(510) 123-4567",
    email: "yonas@example.com",
    address: "Oakland, CA",
    monthlyPayment: "$50",
    spouse: "Sara T.",
    children: [
      { name: "Mekdes", gender: "Female", age: 10 },
      { name: "Nahom", gender: "Male", age: 7 },
    ],
  },
  {
    id: 2,
    fullName: "Ruth Abraham",
    phone: "(408) 765-4321",
    email: "ruth@example.com",
    address: "San Jose, CA",
    monthlyPayment: "$40",
    spouse: "Michael A.",
    children: [],
  },
  
];

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | undefined>();

  useEffect(() => {
    // IMPORTANT: This uses mockMembers directly.
    // When you integrate with the backend, you'll fetch member data by ID here.
    const found = mockMembers.find((m) => m.id === Number(id));
    setMember(found);
  }, [id]); // Re-run when ID from URL changes

  if (!member) return <div className="p-6">Member not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Member Profile</h1>
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Full Name:</strong> {member.fullName}</p>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Address:</strong> {member.address}</p>
        <p><strong>Monthly Payment:</strong> {member.monthlyPayment}</p>
        <p><strong>Spouse:</strong> {member.spouse}</p>

        <div>
          <strong>Children:</strong>
          <ul className="list-disc ml-6">
            {member.children.length === 0 ? (
              <li>No children listed</li>
            ) : (
              member.children.map((child, index) => (
                <li key={index}>
                  {child.name} – {child.gender}, {child.age} years
                </li>
              ))
            )}
          </ul>
        </div>

        <button
          onClick={() => alert("Edit feature coming soon")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit Member
        </button>

        <button
          onClick={() => navigate(-1)} // Navigates back one step in history
          className="ml-2 mt-4 px-4 py-2 bg-gray-300 text-black rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MemberProfile;