
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  api  from "../api/api";
import type { ChangeEvent } from "react";
import type { MemberFormData, Child } from "../types";

const AddMemberForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MemberFormData>({
    firstName:        "",
    lastName:         "",
    telephone:        "",
    email:            "",
    address:          "",
    spouseFirstName:  "",
    spouseLastName:   "",
    spouseTelephone:  "",
    children:         [],
    monthlyPayment:   "", 
    medhaneAlemPledge:"",
    memberSince: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // Generic parent-field handler
  const handleParentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Children-field handler
  const handleChildChange = (
    idx: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const kids = [...prev.children];
      kids[idx] = { ...kids[idx], [name]: value };
      return { ...prev, children: kids };
    });
    setErrors(prev => {
      const cp = { ...prev };
      delete cp[`childName${idx}`];
      delete cp[`childBirthDate${idx}`];
      delete cp[`childGender${idx}`];
      return cp;
    });
  };

  // Add / Remove
  const handleAddChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: "", birthDate: "", gender: "" }],
    }));
  };
  const handleRemoveChild = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== idx),
    }));
  };

  // Simple validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName)  newErrors.lastName  = "Last Name is required.";
    if (!formData.telephone) newErrors.telephone = "Telephone is required.";
    if (!formData.email)     newErrors.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.address)   newErrors.address   = "Address is required.";

    formData.children.forEach((child, idx) => {
      if (!child.name)      newErrors[`childName${idx}`]      = "Name is required.";
      if (!child.birthDate) newErrors[`childBirthDate${idx}`] = "Birthdate is required.";
      if (!child.gender)    newErrors[`childGender${idx}`]    = "Gender is required.";
    });

    if (!formData.memberSince) {
      newErrors.memberSince = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitStatus(null);

  if (!validateForm()) {
    setSubmitStatus("Please fix the errors in the form.");
    return;
  }

  // Build payload ONCE
 // Build payload ONCE
const payload = {
  ...formData,
  monthlyPayment:    formData.monthlyPayment    ? Number(formData.monthlyPayment)    : null,
  medhaneAlemPledge: formData.medhaneAlemPledge ? Number(formData.medhaneAlemPledge) : null,
  spouseFirstName:   formData.spouseFirstName?.trim() || null,
  spouseLastName:    formData.spouseLastName?.trim()  || null,
  spouseTelephone:   formData.spouseTelephone?.trim() || null,
};

try {
  const raw = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

  console.log("SENT TOKEN:", raw ? raw.slice(0, 30) + "..." : "(none)");

  if (raw) {
    try {
      // 👇 rename to avoid shadowing your request payload
      const jwtPayload = JSON.parse(atob(raw.split(".")[1].replace(/-/g, '+').replace(/_/g, '/')));
      console.log("TOKEN PAYLOAD:", jwtPayload);
      const expMs = Number(jwtPayload?.exp) * 1000;
      if (Number.isFinite(expMs) && Date.now() >= expMs) {
        setSubmitStatus("Your session has expired. Please sign in again.");
        return;
      }
      const roles = Array.isArray(jwtPayload?.roles) ? jwtPayload.roles : [];
      if (!roles.includes("ADMIN") && !roles.includes("FINANCE_MANAGER")) {
        console.warn("⚠️ Token missing required role. roles=", roles);
      }
    } catch (e) {
      console.warn("Could not decode JWT payload:", e);
    }
  } else {
    delete (api.defaults.headers.common as any).Authorization;
  }

  console.log("AddMember payload:", payload);

  const res = await api.post("/church-members/register", payload, {
    headers: raw ? { Authorization: `Bearer ${raw}` } : {},
  });

  setSubmitStatus("✅ Member added successfully!");
  setTimeout(() => navigate("/members"), 1500);
} catch (err: any) {
  const status = err.response?.status;
  const serverMsg =
    typeof err.response?.data === "string"
      ? err.response.data
      : err.response?.data?.message;

  if (status === 401)       setSubmitStatus(serverMsg || "Your session is invalid or expired. Please sign in again.");
  else if (status === 403)  setSubmitStatus(serverMsg || "You’re signed in but not allowed to do this (forbidden).");
  else if (status === 409)  setSubmitStatus(serverMsg || "Email or phone already exists.");
  else                      setSubmitStatus(serverMsg || "Failed to add member.");
}



};  



  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Member & Children</h1>

      {submitStatus && (
        <div
          className={`mb-4 p-3 rounded ${
            submitStatus.startsWith("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {submitStatus}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Parent info */}
        <h2 className="text-xl font-semibold mb-4">Member Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "First Name",        name: "firstName",          type: "text"   },
            { label: "Last Name",         name: "lastName",           type: "text"   },
            { label: "Telephone",         name: "telephone",          type: "tel"    },
            { label: "Email",             name: "email",              type: "email"  },
            { label: "Address",           name: "address",            type: "text"   },
            { label: "Monthly Payment",   name: "monthlyPayment",     type: "number" },
            { label: "Medhane Alem Pledge", name: "medhaneAlemPledge",type: "number" },
            { label: "Member Since", name: "memberSince",               type: "date" },
            { label: "Spouse First Name", name: "spouseFirstName",    type: "text"   },
            { label: "Spouse Last Name",  name: "spouseLastName",     type: "text"   },
            { label: "Spouse Telephone",  name: "spouseTelephone",    type: "tel"    },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1">{label}:</label>
              <input
                name={name}
                type={type}
                value={(formData as any)[name] ?? ""}
                onChange={handleParentChange}
                className={`w-full border rounded p-2 ${
                  errors[name] ? "border-red-500" : ""
                }`}
              />
              {errors[name] && <p className="text-red-500 text-xs">{errors[name]}</p>}
            </div>
          ))}
        </div>

        {/* Children */}
        <h2 className="text-xl font-semibold mb-4">Children Information</h2>
        {formData.children.map((child, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <strong>Child #{idx + 1}</strong>
              <button
                type="button"
                onClick={() => handleRemoveChild(idx)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                placeholder="Name"
                value={child.name}
                onChange={e => handleChildChange(idx, e)}
                className="border rounded p-2"
              />
              <input
                name="birthDate"
                type="date"
                value={child.birthDate}
                onChange={e => handleChildChange(idx, e)}
                className="border rounded p-2"
              />
              <select
                name="gender"
                value={child.gender}
                onChange={e => handleChildChange(idx, e)}
                className="border rounded p-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {(errors[`childName${idx}`] ||
              errors[`childBirthDate${idx}`] ||
              errors[`childGender${idx}`]) && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`childName${idx}`] ??
                  errors[`childBirthDate${idx}`] ??
                  errors[`childGender${idx}`]}
              </p>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddChild}
          className="bg-gray-200 px-4 py-2 rounded mb-6"
        >
          Add Child
        </button>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
            Save Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberForm;

