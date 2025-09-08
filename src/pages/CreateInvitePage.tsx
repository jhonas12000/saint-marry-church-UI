import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";

// ---- Types (align with your backend DTOs) ----
export type CommitteeRole =
  | "ADMIN"
  | "MEMBER"
  | "CHAIRMAN"
  | "FINANCE_MANAGER"
  | "EDUCATION_LEAD"
  | "SECRETARY";

interface CreateInviteRequest {
  email: string;
  role: CommitteeRole;
  expiresInDays: number; // backend expects this name in your current service
  notes?: string;
  replaceExisting?: boolean; // NEW: tell backend to revoke any active invite and issue a new one
}

interface CreateInviteResponse {
  id: number;
  email: string;
  role: CommitteeRole | string;
  expiresAt: string; // ISO string
  inviteUrl: string; // full URL returned by backend
}

const ROLES: CommitteeRole[] = [
  "MEMBER",
  "FINANCE_MANAGER",
  "EDUCATION_LEAD",
  "SECRETARY",
  "CHAIRMAN",
  "ADMIN",
];

export default function CreateInvitePage() {
  const nav = useNavigate();
  const { token, user } = useAuth();

  const [form, setForm] = useState<CreateInviteRequest>({
    email: "",
    role: "MEMBER",
    expiresInDays: 7,
    notes: "",
    replaceExisting: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateInviteResponse | null>(null);

  const canSubmit = useMemo(() => {
    return (
      !submitting &&
      !!form.email &&
      /.+@.+\..+/.test(form.email) &&
      !!form.role &&
      form.expiresInDays > 0
    );
  }, [form, submitting]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "expiresInDays" ? Number(value) : (value as any),
    }));
  };

  const onToggleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, replaceExisting: e.target.checked }));
  };

  const postInvite = async (payload: CreateInviteRequest) => {
    const authHeader = token && token.startsWith("Bearer ") ? token : token ? `Bearer ${token}` : undefined;
    const resp = await api.post<CreateInviteResponse>(
      "/admin/invites",
      payload,
      { headers: authHeader ? { Authorization: authHeader } : undefined }
    );
    return resp.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await postInvite(form);
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create invite";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const forceReplace = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await postInvite({ ...form, replaceExisting: true });
      setResult(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to create invite";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(result.inviteUrl);
      alert("Invite link copied to clipboard ✅");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result.inviteUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Invite link copied to clipboard ✅");
    }
  };

  const looksLikeActiveExists = /active invite/i.test(error || "");

  const mailtoHref = useMemo(() => {
    if (!result?.inviteUrl) return "#";
    const to = encodeURIComponent(result.email || form.email);
    const subject = encodeURIComponent("Your invite to Saint Marry Church");
    const body = encodeURIComponent(
      `Hello,

You have been invited to sign up as ${result.role}.

Use this secure link: ${result.inviteUrl}

This link expires on: ${new Date(
        result.expiresAt
      ).toLocaleString()}

If you weren't expecting this, please ignore.

Thanks!`
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [result, form.email]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Create Invite</h1>
          <button
            onClick={() => nav(-1)}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Back
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-2xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="member@example.com"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role to grant</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expires (days)</label>
                <input
                  name="expiresInDays"
                  type="number"
                  min={1}
                  value={form.expiresInDays}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={3}
                placeholder="e.g., Board approval 2025-09-03"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="replaceExisting"
                type="checkbox"
                checked={!!form.replaceExisting}
                onChange={onToggleReplace}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="replaceExisting" className="text-sm text-gray-700">
                Replace any existing active invite for this email
              </label>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-start justify-between gap-3">
                <span>{error}</span>
                {looksLikeActiveExists && (
                  <button
                    type="button"
                    onClick={forceReplace}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Replace & reissue link
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-4 py-2 rounded-xl text-white ${
                  canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                {submitting ? "Creating…" : "Create Invite"}
              </button>

              {user?.roles && (
                <span className="text-xs text-gray-500">Signed in as: <strong>{user.firstName} {user.lastName}</strong></span>
              )}
            </div>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Invite Created</h2>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Email: <span className="font-medium">{result.email}</span></div>
                <div className="text-sm text-gray-600">Role: <span className="font-medium">{String(result.role)}</span></div>
                <div className="text-sm text-gray-600">Expires: <span className="font-medium">{new Date(result.expiresAt).toLocaleString()}</span></div>

                <label className="block text-sm font-medium text-gray-700">Invite Link</label>
                <div className="flex gap-2">
                  <input
                    value={result.inviteUrl}
                    readOnly
                    className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button onClick={copyToClipboard} className="px-3 py-2 rounded-xl bg-gray-800 text-white hover:bg-black">Copy</button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={mailtoHref}
                    className="px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                  >
                    Send via Email
                  </a>
                  <a
                    href={result.inviteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Helper box */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Tip: The link is bound to the email you entered. The recipient should use the same email during sign-up.
          </p>
        </div>
      </div>
    </div>
  );
}
