import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import  api  from "../api/api";
import type { MemberFormData} from "../types";

const EditMemberForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    telephone: "",
    email: "",
    address: "",
    spouseFirstName: "",
    spouseLastName: "",
    spouseTelephone: "",
    children: [],
    monthlyPayment: "",
    medhaneAlemPledge: "",
    memberSince: "",
  });
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1) Load existing member
  useEffect(() => {
    if (!id) return;
    api
      .get<MemberFormData>(`/church-members/${id}`)
      .then((res) => {
        const m = res.data;
        setFormData({
          id: m.id,  
          firstName:        m.firstName        ?? "",
          lastName:         m.lastName         ?? "",
          telephone:        m.telephone        ?? "",
          email:            m.email            ?? "",
          address:          m.address          ?? "",
          spouseFirstName:  m.spouseFirstName  ?? "",
          spouseLastName:   m.spouseLastName   ?? "",
          spouseTelephone:  m.spouseTelephone  ?? "",
          children:         m.children         || [],
          monthlyPayment:   m.monthlyPayment   ?? undefined,
          medhaneAlemPledge:m.medhaneAlemPledge?? undefined,
          memberSince:      m.memberSince?? "",
        });
      })
      .catch((err) => {
        console.error("Failed to load member", err);
        setStatus("Failed to load member.");
      });
  }, [id]);

  // 2) Parent‐field change
  const handleParentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 3) Child‐field change
  const handleChildChange = (
    idx: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const kids = [...prev.children];
      kids[idx] = { ...kids[idx], [name]: value };
      return { ...prev, children: kids };
    });
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp[`childName${idx}`];
      delete cp[`childBirthDate${idx}`];
      delete cp[`childGender${idx}`];
      return cp;
    });
  };

  // 4) Add / Remove child
  const handleAddChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { name: "", birthDate: "", gender: "" }],
    }));
  };
  const handleRemoveChild = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== idx),
    }));
    setErrors((prev) => {
      const cp = { ...prev };
      delete cp[`childName${idx}`];
      delete cp[`childBirthDate${idx}`];
      delete cp[`childGender${idx}`];
      return cp;
    });
  };

  // 5) Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName)      newErrors.firstName = "Required";
    if (!formData.lastName)       newErrors.lastName  = "Required";
    if (!formData.telephone)      newErrors.telephone = "Required";
    if (!formData.email)          newErrors.email     = "Required";
    if (!formData.address)        newErrors.address   = "Required";
    formData.children.forEach((c, i) => {
      if (!c.name)      newErrors[`childName${i}`]      = "Required";
      if (!c.birthDate) newErrors[`childBirthDate${i}`] = "Required";
      if (!c.gender)    newErrors[`childGender${i}`]    = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 6) Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    if (!validateForm()) {
      setStatus("Fix errors");
      return;
    }

    const payload = {
      ...formData,
      monthlyPayment:   formData.monthlyPayment   ?? undefined,
      medhaneAlemPledge:formData.medhaneAlemPledge?? undefined,
    };
    
    await api.put(`/church-members/${id}`, payload);


    console.log("Updating member:", payload);

    try {
      await api.put(`/church-members/${id}`, payload);
      setStatus("✅ Updated!");
      setTimeout(() => navigate(`/members/${id}`), 1000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to update");
    }
  };

  // 7) Render
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow my-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="underline text-gray-600 mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center">Edit Member</h1>

      {status && (
        <div
          className={`mb-4 p-3 rounded ${
            status.startsWith("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Parent fields */}
        <h2 className="font-semibold mb-3">Member Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "First Name",       name: "firstName", type: "text"   },
            { label: "Last Name",        name: "lastName",  type: "text"   },
            { label: "Telephone",        name: "telephone", type: "tel"    },
            { label: "Email",            name: "email",     type: "email"  },
            { label: "Address",          name: "address",   type: "text"   },
            { label: "Monthly Payment",  name: "monthlyPayment",    type: "number" },
            { label: "Medhane Alem Pledge", name: "medhaneAlemPledge", type: "number" },
            { label: "Member Since", name: "memberSince", type: "date" },
            { label: "Spouse First Name",name: "spouseFirstName",   type: "text"   },
            { label: "Spouse Last Name", name: "spouseLastName",    type: "text"   },
            { label: "Spouse Telephone", name: "spouseTelephone",   type: "tel"    },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1">{label}</label>
              <input
                name={name}
                type={type}
                value={(formData as any)[name] ?? ""}
                onChange={handleParentChange}
                className="w-full border rounded p-2"
              />
              {errors[name] && (
                <p className="text-red-500 text-xs">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Children */}
        <h2 className="font-semibold mb-3">Children Information</h2>
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
                value={child.name ?? ""}
                onChange={(e) => handleChildChange(idx, e)}
                className="border rounded p-2"
              />
              <input
                name="birthDate"
                type="date"
                value={child.birthDate ?? ""}
                onChange={(e) => handleChildChange(idx, e)}
                className="border rounded p-2"
              />
              <select
                name="gender"
                value={child.gender ?? ""}
                onChange={(e) => handleChildChange(idx, e)}
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
                {errors[`childName${idx}`] ||
                  errors[`childBirthDate${idx}`] ||
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMemberForm;
