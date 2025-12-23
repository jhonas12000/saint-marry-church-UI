import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface TeachersListProps {
  apiEndpoint?: string;
}

const TeachersList: React.FC<TeachersListProps> = ({
  apiEndpoint = "/api/education/teachers",
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const resp = await axios.get<Teacher[]>(apiEndpoint);
      setTeachers(Array.isArray(resp.data) ? resp.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
      setError("Failed to load teachers.");
    } finally {
      setLoading(false);
    }
  };

  // reload when page is revisited
  useEffect(() => {
    loadTeachers();
  }, [apiEndpoint, location.key]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await axios.delete(`${apiEndpoint}/${id}`);
      loadTeachers();
    } catch (err) {
      console.error("Failed to delete teacher", err);
      alert("Failed to delete teacher.");
    }
  };

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Teachers List</h1>
        <button
          onClick={() => navigate("/education/tigrigna-study/teachers/add")}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
        >
          + Add New Teacher
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {teachers.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.email}</td>
                <td className="px-4 py-2">{t.phone}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/education/tigrigna-study/teachers/${t.id}`)
                    }
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/education/tigrigna-study/teachers/${t.id}/edit`)
                    }
                    className="text-green-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeachersList;
