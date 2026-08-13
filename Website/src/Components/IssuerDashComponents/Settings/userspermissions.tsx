import { useState } from "react";
import { UserPlus, X, MoreVertical, Trash2, ShieldCheck } from "lucide-react";

/* ══════════════════════════════════════════════════════
   USERS & PERMISSIONS
   route: /issuerdashboard/settings/users-permissions
   v1 scope: just "Institution Admin" and "Staff" — more
   granular roles (Certificate Officer, Verification Officer)
   come later per spec.
   ══════════════════════════════════════════════════════ */

type Role = "Institution Admin" | "Staff";
type UserStatus = "Active" | "Invited" | "Suspended";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

const ROLES: Role[] = ["Institution Admin", "Staff"];

// 🔧 Replace with GET /api/issuer/users
const initialUsers: StaffUser[] = [
  { id: "USR-01", name: "Priya Sharma", email: "priya.sharma@engineeringcollege.edu", role: "Institution Admin", status: "Active" },
  { id: "USR-02", name: "Karan Joshi", email: "karan.joshi@engineeringcollege.edu", role: "Staff", status: "Active" },
  { id: "USR-03", name: "Meera Nair", email: "meera.nair@engineeringcollege.edu", role: "Staff", status: "Invited" },
];

function StatusPill({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    Active: "bg-emerald-50 text-emerald-600",
    Invited: "bg-amber-50 text-amber-600",
    Suspended: "bg-rose-50 text-rose-500",
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-light text-brand">
      <ShieldCheck size={12} /> {role}
    </span>
  );
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (u: { name: string; email: string; role: Role }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Staff");
  const canSubmit = name.trim() && email.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40">
      <div className="bg-white rounded-2xl p-6 w-[420px] max-w-[92vw]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy text-base">Invite Team Member</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-navy"><X size={18} /></button>
        </div>
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-navy">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none" placeholder="e.g. Karan Joshi" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none" placeholder="name@institution.edu" />
          </div>
          <div>
            <label className="text-xs font-semibold text-navy">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none appearance-none cursor-pointer">
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button
            disabled={!canSubmit}
            onClick={() => { onInvite({ name: name.trim(), email: email.trim(), role }); onClose(); }}
            className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${canSubmit ? "bg-brand text-white hover:bg-brand/90" : "bg-brand-light text-slate-400 cursor-not-allowed"}`}
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPermissions() {
  const [users, setUsers] = useState<StaffUser[]>(initialUsers);
  const [showInvite, setShowInvite] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleInvite = (u: { name: string; email: string; role: Role }) => {
    // 🔧 Call POST /api/issuer/users/invite here
    setUsers((prev) => [...prev, { id: `USR-${prev.length + 1}`, ...u, status: "Invited" }]);
  };

  const changeRole = (id: string, role: Role) => {
    // 🔧 Call PATCH /api/issuer/users/:id here
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setOpenMenuId(null);
  };

  const removeUser = (id: string) => {
    // 🔧 Call DELETE /api/issuer/users/:id here
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Manage staff members who can access the institution account.</p>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors whitespace-nowrap"
        >
          <UserPlus size={15} /> Invite User
        </button>
      </div>

      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-light">
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-navy"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 relative">
                  <td className="px-5 py-3.5 font-semibold text-navy whitespace-nowrap">{u.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3.5"><StatusPill status={u.status} /></td>
                  <td className="px-5 py-3.5 text-right relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                      className="text-slate-400 hover:text-navy p-1"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === u.id && (
                      <div className="absolute right-5 top-10 z-10 bg-white border border-slate-100 rounded-xl shadow-md py-1.5 w-44 text-left">
                        {ROLES.filter((r) => r !== u.role).map((r) => (
                          <button
                            key={r}
                            onClick={() => changeRole(u.id, r)}
                            className="w-full text-left px-3 py-2 text-xs text-navy hover:bg-brand-light"
                          >
                            Make {r}
                          </button>
                        ))}
                        <button
                          onClick={() => removeUser(u.id)}
                          className="w-full flex items-center gap-1.5 text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </div>
  );
}