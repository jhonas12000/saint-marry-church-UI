
import  { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import type { MemberDTO as BaseMemberDTO, Child } from "../types";

// Ensure this file "sees" medhaneAlemPledge on the DTO even if a stale type is imported elsewhere
type MemberDTO = BaseMemberDTO & { medhaneAlemPledge?: number | null };

interface Payment {
  id: number;
  amount: number;
  monthPaid: string;
  paymentDate: string; // "YYYY-MM-DD"
  memberSince: string;
}

export default function MemberProfile() {
  // Explicitly type params so `id` is recognized; it can be string | undefined
  const params = useParams<{ id: string }>();
  const id = params.id; // string | undefined
  const navigate = useNavigate();

  const [member, setMember] = useState<MemberDTO | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [status, setStatus] = useState<string>("");

  // Fetch member (including children)
  useEffect(() => {
    if (!id) return; // narrow undefined
    api
      .get<MemberDTO>(`/church-members/${id}`)
      .then((res) => setMember(res.data))
      .catch((err) => {
        console.error("Error loading member", err);
        setStatus("Failed to load member.");
      });
  }, [id]);

  // Fetch payments
  useEffect(() => {
    if (!id) return;
    api
      .get<Payment[]>(`/payments/member/${id}`)
      .then((res) => setPayments(res.data))
      .catch((err) => {
        console.error("Error loading payments", err);
        setStatus("Failed to load payments.");
      });
  }, [id]);

  if (status) {
    return (
      <div className="p-4 text-red-600">
        {status}
        <button
          onClick={() => navigate("/members")}
          className="ml-4 text-blue-600 underline"
        >
          ← Back to Members
        </button>
      </div>
    );
  }

  if (!member) {
    return <p className="p-4">Loading member…</p>;
  }

  // date helper
  const formatDate = (iso: string) => {
    const [yr, mo, da] = iso.split("-");
    return `${+mo}/${+da}/${yr}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow my-8">
      <button
        onClick={() => navigate("/members")}
        className="text-gray-600 underline mb-4"
      >
        ← Back to Members
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {member.firstName} {member.lastName}
        </h1>
        <Link
          to={`/members/${member.id}/edit`}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <strong>Phone:</strong> {member.telephone}
          </p>
          <p>
            <strong>Email:</strong> {member.email}
          </p>
          <p>
            <strong>Address:</strong> {member.address}
          </p>
          <p>
            <strong>Monthly Payment:</strong>{" "}
            {member.monthlyPayment ?? "—"}
          </p>
          <p>
            <strong>Medhane-Alem:</strong>{" "}
            {member.medhaneAlemPledge ?? "—"}
          </p>
          <p>
            <strong>Member since: {member.memberSince}</strong>
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Spouse Information</h2>
          <p>
            <strong>First Name:</strong> {member.spouseFirstName || "—"}
          </p>
          <p>
            <strong>Last Name:</strong> {member.spouseLastName || "—"}
          </p>
          <p>
            <strong>Telephone:</strong> {member.spouseTelephone || "—"}
          </p>
        </div>
      </div>

      {/* Children */}
      <h2 className="text-xl font-semibold mb-2">Children</h2>
      {member.children && member.children.length > 0 ? (
        <ul className="list-disc pl-5 mb-6">
          {member.children.map((child: Child, idx: number) => (
            <li key={idx} className="mb-2">
              <p>
                <strong>Name:</strong> {child.name}
              </p>
              <p>
                <strong>Gender:</strong> {child.gender}
              </p>
              <p>
                <strong>DOB:</strong> {formatDate(child.birthDate)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6">No children recorded.</p>
      )}

      {/* Payment History */}
      <h2 className="text-xl font-semibold mb-2">Payment History</h2>
      {payments.length === 0 ? (
        <p>No payments recorded.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Payment Date</th>
              <th className="border px-2 py-1 text-right">Amount</th>
              <th className="border px-2 py-1 text-left">Month</th>
              <th className="border px-2 py-1 text-left">Year</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const [yr, mo, da] = p.paymentDate.split("-");
              return (
                <tr key={p.id}>
                  <td className="border px-2 py-1">{`${+mo}/${+da}/${yr}`}</td>
                  <td className="border px-2 py-1 text-right">
                    {p.amount.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">{p.monthPaid}</td>
                  <td className="border px-2 py-1">{yr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

