// src/pages/Members.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import MembersListView from "../components/members/MembersListView";
import MembersTableView from "./MembersTableView";
import type { Member } from "../auth/types";

// initial view based on current viewport
const getResponsiveDefaultView = (): "list" | "table" => {
  if (typeof window === "undefined") return "table";
  return window.matchMedia("(max-width: 767px)").matches ? "list" : "table";
};

const Members: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentContentView, setCurrentContentView] = useState<"list" | "table">(getResponsiveDefaultView);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  // If user clicks a view button, stop auto-following resize
  const userOverrodeView = useRef(false);

  const fetchMembers = async () => {
    try {
      setErr("");
      setLoading(true);
      const { data } = await api.get<Member[]>("/church-members");
      setMembers(data);
    } catch (e: any) {
      const status = e?.response?.status;
      setErr(
        status === 401 || status === 403
          ? "Your session isn’t authorized for this resource."
          : "Failed to fetch members."
      );
      console.error("Failed to fetch members", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMembers();
  }, [user]);

  // Auto-switch on viewport changes unless user manually chose a view
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      if (userOverrodeView.current) return;
      setCurrentContentView(mql.matches ? "list" : "table");
    };

    // apply once on mount (in case hydration differs)
    apply();

    // Support old Safari
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      if (userOverrodeView.current) return;
      setCurrentContentView(matches ? "list" : "table");
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", handler as EventListener);
    } else {
      // @ts-ignore - legacy
      mql.addListener(handler);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler as EventListener);
      } else {
        // @ts-ignore - legacy
        mql.removeListener(handler);
      }
    };
  }, []);

  const chooseList = () => {
    userOverrodeView.current = true;
    setCurrentContentView("list");
  };
  const chooseTable = () => {
    userOverrodeView.current = true;
    setCurrentContentView("table");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Church Members</h1>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left cluster: 3 view buttons */}
        <div className="flex w-full flex-nowrap gap-2 sm:inline-flex sm:w-auto sm:gap-3">
          <button
            onClick={chooseList}
            className={`flex-1 basis-1/3 min-w-0 truncate text-center text-xs px-2 py-2 rounded-md transition sm:flex-none sm:text-sm sm:px-4 sm:py-2 ${
              currentContentView === "list"
                ? "bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            List View
          </button>

          <button
            onClick={chooseTable}
            className={`flex-1 basis-1/3 min-w-0 truncate text-center text-xs px-2 py-2 rounded-md transition sm:flex-none sm:text-sm sm:px-4 sm:py-2 ${
              currentContentView === "table"
                ? "bg-green-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Table View
          </button>

          <button
            onClick={() => navigate("/members/finance-officer")}
            className="flex-1 basis-1/3 min-w-0 truncate text-center text-xs px-2 py-2 rounded-md transition bg-purple-600 hover:bg-purple-700 text-white sm:flex-none sm:text-sm sm:px-4 sm:py-2"
          >
            Finance Officer View
          </button>
        </div>

        {/* Right: Add button (same line on desktop, full width below on mobile) */}
        <div className="sm:flex sm:items-center sm:justify-end">
          <button
            onClick={() => navigate("/members/add")}
            className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
          >
            Add New Member
          </button>
        </div>
      </div>

      {loading && <p>Loading members...</p>}

      {!loading && err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && (
        <>
          {currentContentView === "list" && (
            <MembersListView members={members} refreshMembers={fetchMembers} />
          )}
          {currentContentView === "table" && (
            <MembersTableView members={members} refreshMembers={fetchMembers} />
          )}
        </>
      )}
    </div>
  );
};

export default Members;
