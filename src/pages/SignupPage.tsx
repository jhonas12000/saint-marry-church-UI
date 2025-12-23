import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
 // baseURL should be http://localhost:8080/api

type Role = "ADMIN" | "MEMBER" | "CHAIRPERSON" | "FINANCE_MANAGER" | "EDUCATION_LEAD" | "SECRETARY";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: Role; // temporary role chooser
};

const initialForm: SignupForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "MEMBER",
};

const SignupPage: React.FC = () => {
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Valid email is required";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMsg(null);
    const err = validate();
    if (err) {
      setServerMsg({ type: "err", text: err });
      return;
    }
    setLoading(true);
    try {
      // Adjust payload keys to match your backend DTO
      // Common DTO: { firstName, lastName, email, phone, password, roles }
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone?.trim() || null,
        password: form.password,
        roles: [form.role], // temporary: create a user with a single role
      };

      // Endpoint assumed: POST /api/auth/signup
      await api.post("/auth/signup", payload);

      setServerMsg({ type: "ok", text: "Signup successful. You can sign in now." });
      // Optional small delay then navigate to signin
      setTimeout(() => navigate("/signin"), 600);
    } catch (e: any) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        (status === 409
          ? "Email or phone already exists."
          : status === 400
          ? "Invalid data. Please check your inputs."
          : "Signup failed. Please try again.");
      setServerMsg({ type: "err", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Temporary signup for testing</p>

        {serverMsg && (
          <div
            className={`mb-4 rounded-lg px-3 py-2 text-sm ${
              serverMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {serverMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yonas"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Weldemichael"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-gray-400"></span>
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 555-5555"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {/* Temporary: pick a single role at signup */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role (temporary)</label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CHAIRMAN">CHAIRMAN</option>
              <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
              <option value="EDUCATION_LEAD">EDUCATION_LEAD</option>
              <option value="SECRETARY">SECRETARY</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white font-medium py-2.5 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
