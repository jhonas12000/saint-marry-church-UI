import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import type { AuthResponse } from "../auth/types";

type ValidateInviteResponse = {
  email?: string | null;
  role?: string | null;
  expiresAt?: string | null;
  valid?: boolean; // optional, in case your backend returns it
};

type SignupForm = {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  username?: string;
  password: string;
};

// --- Extract token robustly: /invite/:token OR /invite?token=... OR /invite?t=... OR hash ---
function useInviteToken(): string {
  const { token: tokenFromPath } = useParams<{ token: string }>();
  const [sp] = useSearchParams();
  const hashParams = new URLSearchParams(window.location.hash?.slice(1) || "");

  return (
    (tokenFromPath ?? "").trim() ||
    (sp.get("token") ?? "").trim() ||
    (sp.get("t") ?? "").trim() ||
    (hashParams.get("token") ?? "").trim() ||
    (hashParams.get("t") ?? "").trim()
  );
}

const InviteSignup: React.FC = () => {
  const token = useInviteToken();
  const navigate = useNavigate();
  const { signin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<ValidateInviteResponse | null>(null);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
  });

  // Validate invite on mount
  useEffect(() => {
    let mounted = true;

    if (!token) {
      setError("This invite link is missing a token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Query-style validate (permitAll)
        const res = await api.get<ValidateInviteResponse>("/auth/validate-invite", {
          params: { token },
        });
        if (!mounted) return;
        // If backend returns {valid:false}, treat as error
        if (res.data && res.data.valid === false) {
          setError("This invite is invalid, expired, or already used.");
        } else {
          setInvite(res.data ?? {});
        }
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ??
          e?.response?.data?.error ??
          "This invite is invalid, expired, or already used.";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post<AuthResponse>("/auth/signup-with-invite", {
        token,
        ...form,
      });

      // Store auth (JWT, user) then go to your app home
      signin(res.data);
      navigate("/", { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        "Signup failed. Please try again.";
      setError(msg);
    }
  };

  if (loading) {
    return <div className="p-6">Checking your invite…</div>;
  }

  if (!token) {
    return <div className="p-6 text-red-600">This invite link is missing a token.</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  // invite may be null if the backend returns nothing; handle gracefully
  const invitedEmail = invite?.email ?? "(email will be collected)";
  const invitedRole = invite?.role ?? "(role)";

  return (
    <div className="max-w-xl mx-auto my-10 px-6 py-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-2">Complete your signup</h1>
      <p className="text-sm text-gray-600 mb-4">
        Invited email: <b>{invitedEmail}</b>
        {invitedRole ? <> &nbsp;•&nbsp; Role: <b>{invitedRole}</b></> : null}
      </p>

      {invite?.expiresAt && (
        <p className="text-xs text-gray-500 mb-4">
          This invite expires on <b>{new Date(invite.expiresAt).toLocaleString()}</b>.
        </p>
      )}

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">First name</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Last name</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Phone </span>
          <input
            className="border rounded-xl px-3 py-2"
            name="phone"
            value={form.phone ?? ""}
            onChange={onChange}
          />
        </label>
        <label className="grid gap-1 mb-4">
          <span className="text-sm text-gray-600">Email</span>
          <input
            value={invitedEmail}
            disabled
            className="border rounded-xl px-3 py-2 bg-gray-100"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Username (optional)</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="username"
            value={form.username ?? ""}
            onChange={onChange}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Password</span>
          <input
            className="border rounded-xl px-3 py-2"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          className="mt-2 py-2 rounded-2xl bg-black text-white hover:opacity-90"
        >
          Create account
        </button>
      </form>
    </div>
  );
};

export default InviteSignup;
