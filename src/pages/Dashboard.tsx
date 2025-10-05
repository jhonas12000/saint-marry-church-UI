// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { User2, Mail, Phone, BadgeCheck } from "lucide-react";

type CommitteeMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  roles?: string[]; // optional; render only if present
};

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// No replaceAll; works with older TS/JS targets
const beautifyRole = (role: string): string =>
  role
    .replace(/_/g, " ")                           // all underscores to spaces
    .toLowerCase()
    .replace(/\b\w/g, (ch: string) => ch.toUpperCase()); // title case

const Dashboard: React.FC = () => {
  const [me, setMe] = useState<CommitteeMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // matches your CommitteeProfilePage self-mode endpoint
        const res = await api.get<CommitteeMember>("/committee/me");
        if (!alive) return;
        setMe(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.message || "Failed to load your profile.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const greeting = useMemo(() => greetingForNow(), []);
  const fullName = me ? `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() : "";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Greeting Bar */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {greeting}
            {me?.firstName ? `, ${me.firstName}` : ""} 👋
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your committee dashboard.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">
        {loading && (
          <div className="rounded-xl border bg-white p-6 text-gray-700">
            Loading your profile…
          </div>
        )}

        {!loading && err && (
          <div className="rounded-xl border bg-red-50 p-6 text-red-700">
            {err}
          </div>
        )}

        {!loading && me && (
          <div className="rounded-2xl border bg-white shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Avatar + Basics */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User2 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    {fullName || "Your Name"}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{me.email}</span>
                  </div>
                  {me.phone && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{me.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Roles (render only if present) */}
              {Array.isArray(me.roles) && me.roles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {me.roles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200"
                    >
                      <BadgeCheck className="h-4 w-4" />
                      {beautifyRole(r)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Address (optional) */}
            {me.address && (
              <div className="mt-4 text-sm text-gray-700">
                <span className="font-medium">Address:</span> {me.address}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
