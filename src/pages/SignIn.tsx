// src/pages/SignIn.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import type { AuthResponse } from "../auth/types";
import { Eye, EyeOff } from "lucide-react";

const DEFAULT_AFTER_LOGIN = "/dashboard";

const SignIn: React.FC = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/auth/signin", {
        email: form.username.trim(),
        password: form.password,
      });

      // Extract token from common places
      let token =
        (res.data as any)?.token ||
        (res.data as any)?.jwt ||
        (res.data as any)?.accessToken ||
        res.headers?.authorization ||
        "";

      if (!token) {
        console.error("Signin response did not include a token:", res.data, res.headers);
        setError("Signin succeeded but no token was returned by the server.");
        return;
      }
      if (token.startsWith("Bearer ")) token = token.slice(7);

      localStorage.setItem("token", token);
      signin(res.data);

      // Prefer where the user tried to go, but fall back to /dashboard (not "/")
      const from = (location.state as any)?.from?.pathname as string | undefined;
      const goTo =
        from && from !== "/signin" && !from.startsWith("/invite")
          ? from
          : DEFAULT_AFTER_LOGIN;

      navigate(goTo, { replace: true });
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ??
        (status === 401 ? "Invalid credentials." : "Signin failed. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
          Committee Member Sign In
        </h1>
        <p className="text-gray-500 mb-6">Access your committee dashboard.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username or Email</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., yonas@example.com"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-2.5 mt-2 hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
