// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export interface Teacher {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface TeachersListProps {
//   endpoint?: string; // Optional override
// }

// const TeachersList: React.FC<TeachersListProps> = ({ endpoint = '/api/education/teachers' }) => {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const loadTeachers = async () => {
//     setLoading(true);
//     try {
//       const resp = await axios.get<Teacher[]>(endpoint);
//       setTeachers(resp.data);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch teachers', err);
//       setError('Failed to load teachers.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTeachers();
//   }, [endpoint]);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Delete this teacher?')) return;
//     try {
//       await axios.delete(`${endpoint}/${id}`);
//       loadTeachers();
//     } catch (err) {
//       console.error('Failed to delete teacher', err);
//       alert('Failed to delete teacher.');
//     }
//   };

//   if (loading) return <p>Loading teachers...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div className="overflow-x-auto bg-white rounded shadow">
//       <table className="min-w-full divide-y">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 text-left">Name</th>
//             <th className="px-4 py-2 text-left">Email</th>
//             <th className="px-4 py-2 text-left">Phone</th>
//             <th className="px-4 py-2 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y">
//           {teachers.map((t) => (
//             <tr key={t.id} className="hover:bg-gray-50">
//               <td className="px-4 py-2">{t.name}</td>
//               <td className="px-4 py-2">{t.email}</td>
//               <td className="px-4 py-2">{t.phone}</td>
//               <td className="px-4 py-2 space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => navigate(`${endpoint}/${t.id}`)}
//                   className="text-blue-600 hover:underline text-sm"
//                 >
//                   View
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => navigate(`${endpoint}/${t.id}/edit`)}
//                   className="text-green-600 hover:underline text-sm"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleDelete(t.id)}
//                   className="text-red-600 hover:underline text-sm"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TeachersList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Prefer your project's axios instance if you have auth headers:
// import api from "../../api/api";
import axios from "axios";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface TeachersListProps {
  /** Backend endpoint to fetch teachers (API). */
  endpoint?: string;
  /** Base client route for view/edit pages (React Router). */
  routeBase?: string;
}

const TeachersList: React.FC<TeachersListProps> = ({
  endpoint = "/api/education/teachers",
  routeBase = "/education/teachers",
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const normalize = (payload: any): Teacher[] => {
    if (Array.isArray(payload)) return payload;
    return payload?.content ?? payload?.items ?? payload?.data ?? [];
  };

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(endpoint);
      const list = normalize(resp.data) as Teacher[];
      // optional: alphabetical order
      list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      setTeachers(list);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
      setError("Failed to load teachers.");
      setTeachers([]); // ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await axios.delete(`${endpoint}/${id}`);
      await loadTeachers();
    } catch (err) {
      console.error("Failed to delete teacher", err);
      alert("Failed to delete teacher.");
    }
  };

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
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
          {(Array.isArray(teachers) ? teachers : []).map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{t.name}</td>
              <td className="px-4 py-2">{t.email}</td>
              <td className="px-4 py-2">{t.phone}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  type="button"
                  // navigate to your client route, not API route
                  onClick={() => navigate(`${routeBase}/${t.id}`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`${routeBase}/${t.id}/edit`)}
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
          {!teachers.length && (
            <tr>
              <td className="px-4 py-6 text-gray-500" colSpan={4}>
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeachersList;

