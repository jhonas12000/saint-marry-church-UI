
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import {
  Mail,
  Phone,
  Search,
  RefreshCw,
  Shield,
  UserCircle2,
  LayoutGrid,
  List,
} from "lucide-react";

type CommitteeMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
};

type SortKey = "name" | "role";

const ROLE_COLORS: Record<string, string> = {
  CHAIRMAN: "bg-purple-100 text-purple-700 ring-purple-200",
  "FINANCE_MANAGER": "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "EDUCATION_LEAD": "bg-blue-100 text-blue-700 ring-blue-200",
  SECRETARY: "bg-amber-100 text-amber-700 ring-amber-200",
  MEMBER: "bg-gray-100 text-gray-700 ring-gray-200",
};

const titleCase = (s?: string) =>
  (s || "")
    .toLowerCase()
    .split(/\s+|_/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");

const initials = (first?: string, last?: string) =>
  `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase() || ""}` || "??";

const Committee: React.FC = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [view, setView] = useState<"grid" | "list">("grid");

  const fetchCommittee = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any[]>("/committee"); // baseURL = /api
      const normalized: CommitteeMember[] = (res.data || []).map((m: any, idx: number) => {
        let first = m.firstName ?? m.fname ?? "";
        let last = m.lastName ?? m.lname ?? "";
        if ((!first || !last) && typeof m.name === "string") {
          const parts = m.name.trim().split(/\s+/);
          first = first || parts[0] || "";
          last = last || parts.slice(1).join(" ");
        }
        return {
          id: m.id ?? idx,
          firstName: first,
          lastName: last,
          email: m.email ?? m.mail ?? m.emailAddress ?? "",
          phone: m.phone ?? m.telephone ?? m.phoneNumber ?? "",
          role: m.role ?? m.title ?? "",
        };
      });

      setMembers(normalized);
    } catch (err: any) {
      setError(
        err?.response?.status
          ? `${err.response.status} ${err.response.statusText}`
          : "Failed to load committee members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = members.filter((m) => {
      if (!q) return true;
      const full = `${m.firstName} ${m.lastName}`.toLowerCase();
      return (
        full.includes(q) || m.email?.toLowerCase().includes(q) || m.phone?.toLowerCase().includes(q)
      );
    });

    if (sortBy === "name") {
      list = [...list].sort((a, b) => {
        const ln = (a.lastName || "").localeCompare(b.lastName || "");
        return ln !== 0 ? ln : (a.firstName || "").localeCompare(b.firstName || "");
      });
    } else if (sortBy === "role") {
      list = [...list].sort((a, b) => (a.role || "").localeCompare(b.role || ""));
    }
    return list;
  }, [members, query, sortBy]);

  // Skeletons for loading
  const SkeletonCard = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="mt-4 h-8 w-full bg-gray-100 rounded animate-pulse" />
    </div>
  );

  const RoleBadge: React.FC<{ role?: string }> = ({ role }) => {
    if (!role) return null;
    const key = role.toUpperCase();
    const cls =
      ROLE_COLORS[key] ||
      "bg-slate-100 text-slate-700 ring-slate-200";
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}>
        <Shield className="h-3.5 w-3.5" />
        {titleCase(role)}
      </span>
    );
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold mb-2">Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchCommittee}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Committee Members</h2>
          <p className="text-sm text-gray-500">Directory of current committee contacts</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone"
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="role">Sort by Role</option>
          </select>

          {/* View toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setView("grid")}
              className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${
                view === "grid" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${
                view === "list" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
        </>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-600">
            No committee members found{query ? ` for “${query}”` : ""}.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                    <UserCircle2 className="h-7 w-7 text-gray-400" />
                  </div>
                  {/* Initials bubble */}
                  {initials(m.firstName, m.lastName) && (
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-gray-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {initials(m.firstName, m.lastName)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold">
                      {m.firstName || "-"} {m.lastName || "-"}
                    </h3>
                    <RoleBadge role={m.role} />
                  </div>

                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 truncate">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {m.email ? (
                        <a
                          href={`mailto:${m.email}`}
                          className="truncate hover:underline"
                          title={m.email}
                        >
                          {m.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 truncate">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {m.phone ? (
                        <a
                          href={`tel:${m.phone.replace(/\s+/g, "")}`}
                          className="truncate hover:underline"
                          title={m.phone}
                        >
                          {m.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
          {filtered.map((m) => (
            <li key={m.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                    <UserCircle2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">
                        {m.firstName || "-"} {m.lastName || "-"}
                      </p>
                      <RoleBadge role={m.role} />
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {m.email || m.phone ? `${m.email || ""}${m.email && m.phone ? " • " : ""}${m.phone || ""}` : "No contact info"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {m.email ? (
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm hover:bg-gray-50"
                      title={m.email}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">N/A</span>
                    </span>
                  )}

                  {m.phone ? (
                    <a
                      href={`tel:${m.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm hover:bg-gray-50"
                      title={m.phone}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">N/A</span>
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Committee;

