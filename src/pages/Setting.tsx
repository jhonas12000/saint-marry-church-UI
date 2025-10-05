// src/pages/Setting.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock } from "lucide-react";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border bg-white shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-amber-700" />
            </div>
            <h1 className="text-2xl font-semibold">Settings (in development)</h1>
          </div>

          <p className="text-gray-700">
            Sorry—this page is currently in <span className="font-medium">development</span>.
            We’re building configuration options for your account and organization.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Some sections may appear soon. Thanks for your patience!</span>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
