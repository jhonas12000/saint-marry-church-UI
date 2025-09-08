import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import type { AuthResponse } from "../auth/types";

type ValidateInviteResponse = {
  email: string;
  role: string;
  expiresAt: string;
};

type SignupForm = {
  firstName: string;
  lastName: string;
  phone?: string;
  username?: string;
  password: string;
};

const InviteSignup: React.FC = () => {
  const { token: pathToken } = useParams<{ token: string }>();
  const [qs] = useSearchParams();
  const token = pathToken || qs.get("token") || "";

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

  useEffect(() => {
    let mounted = true;

    if (!token) {
      setError("This invite link is missing a token.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Use the endpoint your backend actually exposes:
        // EITHER query form:
        const res = await api.get<ValidateInviteResponse>("/api/auth/validate-invite", {
          params: { token },
        });

        // If you wired the path variant instead, use:
        // const res = await api.get<ValidateInviteResponse>(`/api/auth/validate-invite/${token}`);

        if (!mounted) return;
        setInvite(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "This invite is invalid, expired, or already used.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post<AuthResponse>("/api/auth/signup-with-invite", {
        token,
        ...form,
      });
      signin(res.data);            // store JWT per your AuthProvider
      navigate("/dashboard");      // or wherever you want to land
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Signup failed. Please try again.");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Checking your invite…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!invite) return null;

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Set up your account</h2>
      <p style={{ color: "#555" }}>
        Invited email: <b>{invite.email}</b> &nbsp;•&nbsp; Role: <b>{invite.role}</b>
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          First name
          <input name="firstName" value={form.firstName} onChange={onChange} required />
        </label>
        <label>
          Last name
          <input name="lastName" value={form.lastName} onChange={onChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone ?? ""} onChange={onChange} />
        </label>
        <label>
          Username (optional)
          <input name="username" value={form.username ?? ""} onChange={onChange} />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button type="submit" style={{ padding: "10px 14px" }}>
          Create account
        </button>
      </form>
    </div>
  );
};

export default InviteSignup;
