import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import api from "../api/api";

type CommitteeMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
};

const CommitteeProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = useMemo(
    () => !!user?.roles?.includes("ADMIN") || !!user?.roles?.includes("CHAIRPERSON"),
    [user]
  );
  const selfMode = !id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<CommitteeMember | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [address,   setAddress]   = useState("");

  // If someone opens /committee/:id without admin role, bump to self
  useEffect(() => {
    if (!selfMode && !isAdmin) {
      navigate("/committee/me", { replace: true });
    }
  }, [selfMode, isAdmin, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = selfMode ? "/committee/me" : `/committee/${id}`;
        const res = await api.get<CommitteeMember>(url);
        if (cancelled) return;

        const m = res.data;
        setMember(m);
        setFirstName(m.firstName || "");
        setLastName(m.lastName || "");
        setEmail(m.email || "");
        setPhone(m.phone || "");
        setAddress(m.address || "");
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selfMode, id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const payload = { firstName, lastName, email, phone, address };
      if (selfMode) {
        await api.put("/committee/me", payload);
      } else {
        await api.put(`/admin/committee/${id}`, payload);
      }

      navigate("/committee", { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.status === 403 ? "You are not authorized to update this profile." : "Update failed");
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-sm sm:text-base">Loading…</div>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-3 sm:mb-4">
            <Link to="/committee" className="text-sm text-blue-600 hover:underline">← Back to Committee</Link>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 text-red-800 text-sm sm:text-base">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {selfMode && user?.firstName && (
        <div className="mb-3 sm:mb-4 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 sm:px-4 sm:py-3 text-indigo-800 text-sm sm:text-base">
          Welcome back, <span className="font-semibold">{user.firstName}</span>!
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-4 sm:p-6">
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-lg sm:text-2xl font-semibold">
            {selfMode ? "My Profile" : "Edit Committee Member"}
            {selfMode && (
              <span className="ml-2 text-xs sm:text-base text-zinc-500 align-middle">(ME)</span>
            )}
          </h1>
          <Link to="/committee" className="text-sm text-blue-600 hover:underline">← Back</Link>
        </div>

        {error && (
          <div className="mb-3 sm:mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 sm:p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSave} className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm text-gray-600">First name</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm text-gray-600">Last name</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs sm:text-sm text-gray-600">Email</span>
              <input
                type="email"
                className="border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs sm:text-sm text-gray-600">Phone</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring w-full"
                value={phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs sm:text-sm text-gray-600">Address</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm sm:text-base outline-none focus:ring w-full"
                value={address ?? ""}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommitteeProfilePage;
