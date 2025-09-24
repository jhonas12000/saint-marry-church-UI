import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import {
  Mail, Phone, Search, RefreshCw, Shield, UserCircle2, LayoutGrid, List, Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

type CommitteeMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
};

type SortKey = "name" | "role";

const ROLE_REMAP: Record<string, string> = { CHAIRMAN: "CHAIRPERSON" };

const ALL_ROLES = [
  "ADMIN",
  "CHAIRPERSON",
  "FINANCE_MANAGER",
  "EDUCATION_LEAD",
  "SECRETARY",
  "MEMBER",
] as const;

const ROLE_COLORS: Record<string, string> = {
  CHAIRMAN: "bg-purple-100 text-purple-700 ring-purple-200",
  CHAIRPERSON: "bg-purple-100 text-purple-700 ring-purple-200",
  FINANCE_MANAGER: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  EDUCATION_LEAD: "bg-blue-100 text-blue-700 ring-blue-200",
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

const getResponsiveDefaultView = (): "grid" | "list" => {
  if (typeof window === "undefined") return "list";
  return window.matchMedia("(max-width: 767px)").matches ? "grid" : "list";
};

const Committee: React.FC = () => {
  const { user } = useAuth();

  const canChangeRole = !!user?.roles?.includes("ADMIN");
  const canDelete = !!user?.roles?.includes("ADMIN") || !!user?.roles?.includes("CHAIRPERSON");

  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [view, setView] = useState<"grid" | "list">(getResponsiveDefaultView);


  const SELF_PROFILE_PATH = "/committee/me";
  const youId = user?.id ?? null;
  const youEmail = user?.email?.toLowerCase() ?? null;

  const isYou = (m: CommitteeMember) =>
    (youId != null && m.id === youId) ||
    (!!youEmail && (m.email || "").toLowerCase() === youEmail);

  const isAdmin =
    !!user?.roles?.includes("ADMIN") || !!user?.roles?.includes("CHAIRPERSON");

  const linkFor = (m: CommitteeMember) =>
    isYou(m) ? SELF_PROFILE_PATH : (isAdmin ? `/committee/${m.id}` : null);

  const fetchCommittee = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any[]>("/committee");
      const normalized: CommitteeMember[] = (res.data || []).map((m: any, idx: number) => {
        let first = m.firstName ?? m.fname ?? "";
        let last = m.lastName ?? m.lname ?? "";
        if ((!first || !last) && typeof m.name === "string") {
          const parts = m.name.trim().split(/\s+/);
          first = first || parts[0] || "";
          last = last || parts.slice(1).join(" ");
        }
        const rawRole = (m.role ?? m.title ?? "").toString().trim().toUpperCase();
        const role = ROLE_REMAP[rawRole] ?? rawRole;
        return {
          id: m.id ?? idx,
          firstName: first,
          lastName: last,
          email: m.email ?? m.mail ?? m.emailAddress ?? "",
          phone: m.phone ?? m.telephone ?? m.phoneNumber ?? "",
          role,
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

  useEffect(() => { fetchCommittee(); }, []);

  const onChangeRole = async (id: number, newRole: string) => {
    if (!canChangeRole) return;
    const prev = members;
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    try {
      await api.put(`/admin/committee/${id}/role`, { role: newRole });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to update role.");
      setMembers(prev);
    }
  };

  const onDelete = async (id: number) => {
    if (!canDelete) return;
    const m = members.find((x) => x.id === id);
    const name = m ? `${m.firstName} ${m.lastName}` : `#${id}`;
    if (!confirm(`Delete committee member ${name}? This cannot be undone.`)) return;

    const prev = members;
    setMembers((list) => list.filter((x) => x.id !== id));
    try {
      await api.delete(`/admin/committee/${id}`);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to delete member.");
      setMembers(prev);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = members.filter((m) => {
      if (!q) return true;
      const full = `${m.firstName} ${m.lastName}`.toLowerCase();
      return (
        full.includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q)
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

  const SkeletonCard = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 h-8 w-full bg-gray-100 rounded animate-pulse" />
    </div>
  );

  const RoleBadge: React.FC<{ role?: string }> = ({ role }) => {
    if (!role) return null;
    const key = role.toUpperCase();
    const cls = ROLE_COLORS[key] || "bg-slate-100 text-slate-700 ring-slate-200";
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium ring-1 ${cls}`}>
        <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {titleCase(role)}
      </span>
    );
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 text-red-800">
          <p className="font-semibold mb-2">Error</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchCommittee}
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="w-full mx-auto md:mx-0 max-w-[680px] sm:max-w-2xl md:max-w-6xl px-4 md:px-6 py-6 md:py-8">

      {/* Welcome */}
      {user?.firstName && (
        <div className="mb-4 rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 sm:px-4 sm:py-3 text-indigo-800">
          Welcome back, <span className="font-semibold">{user.firstName}</span>!
        </div>
      )}

      {/* Header Bar */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Committee Members</h2>
          <p className="text-xs sm:text-sm text-gray-500">Directory of current committee contacts</p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
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

          {/* Sort + View + Refresh */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
            </select>

            <div className="inline-flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-1 sm:gap-2 rounded-md px-2 py-1.5 text-sm ${
                  view === "grid" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-1 sm:gap-2 rounded-md px-2 py-1.5 text-sm ${
                  view === "list" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={fetchCommittee}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm sm:text-base">
          <p className="text-gray-600">
            No committee members found{query ? ` for “${query}”` : ""}.
          </p>
        </div>
      ) : view === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((m) => {
            const href = linkFor(m);
            const you = isYou(m);
            return (
              <div
                key={m.id}
                className={`group rounded-xl p-3 sm:p-4 shadow-sm transition hover:shadow-md border ${
                  you ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                    <div className="h-full w-full rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                      <UserCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
                    </div>
                    {initials(m.firstName, m.lastName) && (
                      <div className={`absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        you ? "bg-green-700 text-white" : "bg-gray-900 text-white"
                      }`}>
                        {initials(m.firstName, m.lastName)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate font-semibold text-sm sm:text-base">
                        {href ? (
                          <Link to={href} className="hover:underline">
                            {m.firstName || "-"} {m.lastName || "-"}
                            {you && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-green-700 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                                ME
                              </span>
                            )}
                          </Link>
                        ) : (
                          <>
                            {m.firstName || "-"} {m.lastName || "-"}
                            {you && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-green-700 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                                ME
                              </span>
                            )}
                          </>
                        )}
                      </h3>
                      <RoleBadge role={m.role} />
                    </div>

                    <div className="mt-2 space-y-1 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-700 truncate">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {m.email ? (
                          <a href={`mailto:${m.email}`} className="truncate hover:underline" title={m.email}>
                            {m.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 truncate">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {m.phone ? (
                          <a href={`tel:${m.phone.replace(/\s+/g, "")}`} className="truncate hover:underline" title={m.phone}>
                            {m.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </div>

                    {(canChangeRole || canDelete) && (
                      <div className="mt-3 flex items-center gap-2">
                        {canChangeRole && (
                          <select
                            value={m.role || ""}
                            onChange={(e) => onChangeRole(m.id, e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs sm:text-sm"
                            title="Change role (admin only)"
                          >
                            {ALL_ROLES.map((r) => (
                              <option key={r} value={r}>{titleCase(r)}</option>
                            ))}
                          </select>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDelete(m.id)}
                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs sm:text-sm text-red-700 hover:bg-red-50"
                            title="Delete member"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <ul className="overflow-hidden rounded-xl border border-gray-200 bg-white divide-y divide-gray-200">
          {filtered.map((m) => {
            const href = linkFor(m);
            const you = isYou(m);
            return (
              <li
                key={m.id}
                className={`p-3 sm:p-4 transition ${
                  you ? "bg-green-50" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-1 flex items-center justify-center ${
                      you ? "bg-green-100 ring-green-200" : "bg-gray-100 ring-gray-200"
                    }`}>
                      <UserCircle2 className={`h-5 w-5 sm:h-6 sm:w-6 ${you ? "text-green-700" : "text-gray-400"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-sm sm:text-base">
                          {href ? (
                            <Link to={href} className="hover:underline">
                              {m.firstName || "-"} {m.lastName || "-"}
                              {you && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-green-700 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                                  ME
                                </span>
                              )}
                            </Link>
                          ) : (
                            <>
                              {m.firstName || "-"} {m.lastName || "-"}
                              {you && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-green-700 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white">
                                  ME
                                </span>
                              )}
                            </>
                          )}
                        </p>
                        <RoleBadge role={m.role} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {m.email || m.phone
                          ? `${m.email || ""}${m.email && m.phone ? " • " : ""}${m.phone || ""}`
                          : "No contact info"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
                        title={m.email}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-400">
                        <Mail className="h-4 w-4" />
                        N/A
                      </span>
                    )}

                    {m.phone ? (
                      <a
                        href={`tel:${m.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
                        title={m.phone}
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-400">
                        <Phone className="h-4 w-4" />
                        N/A
                      </span>
                    )}

                    {(canChangeRole || canDelete) && (
                      <>
                        {canChangeRole && (
                          <select
                            value={m.role || ""}
                            onChange={(e) => onChangeRole(m.id, e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs sm:text-sm"
                            title="Change role (admin only)"
                          >
                            {ALL_ROLES.map((r) => (
                              <option key={r} value={r}>{titleCase(r)}</option>
                            ))}
                          </select>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDelete(m.id)}
                            className="hidden sm:inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm text-red-700 hover:bg-red-50"
                            title="Delete member"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Committee;
