import React, { useState } from "react";
import api from "../api/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    setLoading(true);
    try {
      // If your axios baseURL does NOT include "/api", change to "/api/auth/forgot-password"
      await api.post("/auth/forgot-password", { email: email.trim() });
      // Avoid account enumeration: always show the same success message.
      setMsg("If an account exists for that email, we sent a reset link.");
    } catch (e: any) {
      // Still show generic success to prevent enumeration; optionally log e
      setMsg("If an account exists for that email, we sent a reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Forgot Password</h1>
        <p className="text-gray-500 mb-6">We’ll email you a password reset link.</p>

        {msg && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">{msg}</div>}
        {err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., yonas@example.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-2.5 mt-2 hover:bg-indigo-700 disabled:opacity-60"
            disabled={loading || !email}
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          <div className="text-center mt-2">
            <a href="/signin" className="text-sm text-gray-600 hover:text-gray-800">Back to sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
