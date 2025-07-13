// src/pages/Welcome.tsx
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to Saint Marry Church</h1>
      <p className="text-gray-700 mb-6">
        Serving the Eritrean community in the Bay Area with faith, unity, and service.
      </p>
      <button
        onClick={() => navigate("/signin")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Sign In
      </button>
    </div>
  );
};

export default Welcome;

