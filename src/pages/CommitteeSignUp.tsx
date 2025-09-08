

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

type ValidateInviteResponse = {
  email: string;
  role: string;
  expiresAt: string;
};

const CommitteeSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [invite, setInvite] = useState<ValidateInviteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
  });

  // Validate invite on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) throw new Error("Missing invite token.");
        const res = await api.get<ValidateInviteResponse>(`/auth/invites/${token}`);
        if (!mounted) return;
        setInvite(res.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "This invite is invalid or has expired.";
        setErrorMsg(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }
    if (!token) {
      setErrorMsg("Missing invite token.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        token, // <-- critical
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        username: form.username.trim(),
        password: form.password,
      };

      const res = await api.post("/auth/signup-with-invite", payload);
      const data = res.data; // { token, id, firstName, lastName, email, phone, roles }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          roles: data.roles,
        })
      );

      setSuccessMsg("Welcome! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Sign up failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <div className="text-gray-600">Checking your invite…</div>
      </div>
    );
  }

  if (errorMsg && !invite) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Invite Problem</h1>
          <p className="text-red-600">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Committee Member Sign Up
        </h1>
        <p className="text-gray-500 mb-6">
          Complete your account using your invite.
        </p>

        {invite && (
          <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-indigo-800 text-sm">
            Invited email: <b>{invite.email}</b> • Role:{" "}
            <b>{invite.role?.replace(/_/g, " ") || ""}</b>
          </div>

        )}

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Yonas"
                autoComplete="given-name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Weldemichael"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone (optional)</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="(555) 555-5555"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Username (optional)</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., yonas.w"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-2.5 mt-2 hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/committee-signin")}
              className="text-indigo-600 hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommitteeSignUp;

