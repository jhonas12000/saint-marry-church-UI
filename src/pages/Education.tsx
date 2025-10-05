// import React from 'react'; // Keep React import
// import { useNavigate } from 'react-router-dom'; // Add this import

// const Education: React.FC = () => { // Add React.FC type for consistency
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleNavigate = (path: string) => {
//     navigate(path);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Education Department</h1>
//       <p className="text-gray-600 mb-8 text-center">Explore different areas of our educational programs.</p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Bible Study Button */}
//         <button
//           onClick={() => handleNavigate('/education/bible-study')}
//           className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
//         >
//           <span className="mb-2 text-3xl">📚</span>
//           Bible Study
//         </button>

//         {/* Tigrigna Study Button */}
//         <button
//           onClick={() => handleNavigate('/education/tigrigna-study')}
//           className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold"
//         >
//           <span className="mb-2 text-3xl">🗣️</span>
//           Tigrigna Study
//         </button>

//         {/* Classrooms Button */}
//         <button
//           onClick={() => handleNavigate('/education/classrooms')}
//           className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
//         >
//           <span className="mb-2 text-3xl">🏫</span>
//           Classrooms
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Education;

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wrench, Clock } from "lucide-react";

const Education: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-white shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-amber-700" />
            </div>
            <h1 className="text-2xl font-semibold">Education (in development)</h1>
          </div>

          <p className="text-gray-700">
            Sorry—this page is currently in <span className="font-medium">development</span>.
            We’re building features for teachers, students, and classrooms.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Some sections may appear soon. Thanks for your patience!</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
            {/* If you want to expose partial areas later, keep these links */}
            {/* <Link
              to="/education/classrooms"
              className="inline-flex justify-center rounded-xl border px-4 py-2.5 hover:bg-gray-50"
            >
              Go to Classrooms
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
