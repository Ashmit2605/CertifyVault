import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  IdCard,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShieldEllipsis,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type UserRole = "Issuer" | "Student" | "Verifier" | "Holder";

type UserStatus = "Active" | "Pending";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
  role: UserRole;
  institution: string;
  department: string;
  lastLogin: string;
  status: UserStatus;
  registeredOn: string;
  emailVerified: boolean;
  avatar: string;
};

type ModalType = "view" | "edit" | "delete" | null;

const roleOptions: UserRole[] = ["Issuer", "Student", "Verifier", "Holder"];

const statusOptions: UserStatus[] = ["Active", "Pending"];

const initialUsers: User[] = [
  {
    id: "USR-3021",
    name: "Rahul Sharma",
    email: "rahul@email.com",
    phone: "+91 98765 43210",
    userId: "USR-3021",
    role: "Student",
    institution: "Pimpri Chinchwad College of Engineering",
    department: "Computer Engineering",
    lastLogin: "2 hours ago",
    status: "Active",
    registeredOn: "2024-01-18",
    emailVerified: true,
    avatar: "RS",
  },
  {
    id: "USR-2115",
    name: "Dr. A. Sharma",
    email: "a.sharma@pccoe.edu",
    phone: "+91 99876 54321",
    userId: "USR-2115",
    role: "Issuer",
    institution: "Pimpri Chinchwad College of Engineering",
    department: "Computer Engineering",
    lastLogin: "1 day ago",
    status: "Active",
    registeredOn: "2023-11-06",
    emailVerified: true,
    avatar: "AS",
  },
  {
    id: "USR-1188",
    name: "Admin User",
    email: "admin@verichain.ai",
    phone: "+1 415 555 0113",
    userId: "USR-1188",
    role: "Holder",
    institution: "Platform",
    department: "Operations",
    lastLogin: "15 minutes ago",
    status: "Active",
    registeredOn: "2023-08-09",
    emailVerified: true,
    avatar: "AU",
  },
  {
    id: "USR-4404",
    name: "Ananya Kulkarni",
    email: "ananya.kulkarni@gmail.com",
    phone: "+91 77090 11223",
    userId: "USR-4404",
    role: "Verifier",
    institution: "Pimpri Chinchwad College of Engineering",
    department: "Mechanical Engineering",
    lastLogin: "4 days ago",
    status: "Pending",
    registeredOn: "2024-03-04",
    emailVerified: false,
    avatar: "AK",
  },
  {
    id: "USR-7789",
    name: "Nikhil Patil",
    email: "nikhil.patil@mitpune.edu",
    phone: "+91 78945 30111",
    userId: "USR-7789",
    role: "Issuer",
    institution: "MIT Pune",
    department: "Administration",
    lastLogin: "6 days ago",
    status: "Active",
    registeredOn: "2023-06-14",
    emailVerified: true,
    avatar: "NP",
  },
  {
    id: "USR-9911",
    name: "Sakshi Deshmukh",
    email: "sakshi@iitb.ac.in",
    phone: "+91 91232 99887",
    userId: "USR-9911",
    role: "Student",
    institution: "IIT Bombay",
    department: "Academic Review",
    lastLogin: "Never",
    status: "Pending",
    registeredOn: "2024-02-11",
    emailVerified: true,
    avatar: "SD",
  },
];

const institutionOptions = [
  "Pimpri Chinchwad College of Engineering",
  "MIT Pune",
  "IIT Bombay",
  "Platform",
  "VIT Pune",
];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(date),
  );

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-600">{title}</div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
  const [roleToggle, setRoleToggle] = useState<UserRole | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Student" as UserRole,
    institution: "Pimpri Chinchwad College of Engineering",
    department: "Computer Engineering",
  });

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        [user.name, user.email, user.userId, user.phone, user.institution].some((value) =>
          value.toLowerCase().includes(query),
        );

      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      const matchesToggle = !roleToggle || user.role === roleToggle;

      return matchesSearch && matchesRole && matchesStatus && matchesToggle;
    });
  }, [users, search, selectedRole, selectedStatus, roleToggle]);

  const stats = useMemo(
    () => [
      { title: "Total Users", value: users.length.toLocaleString(), icon: Users, accent: "bg-sky-100 text-sky-700" },
      {
        title: "Active Users",
        value: users.filter((user) => user.status === "Active").length.toLocaleString(),
        icon: CheckCircle2,
        accent: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Pending Users",
        value: users.filter((user) => user.status === "Pending").length.toLocaleString(),
        icon: Clock3,
        accent: "bg-amber-100 text-amber-700",
      },
      {
        title: "Administrators",
        value: users.filter((user) => ["Issuer", "Holder"].includes(user.role)).length.toLocaleString(),
        icon: ShieldCheck,
        accent: "bg-violet-100 text-violet-700",
      },
    ],
    [users],
  );

  const resetFilters = () => {
    setSearch("");
    setSelectedRole("");
    setSelectedStatus("");
    setRoleToggle(null);
  };

  const createUser = () => {
    const fullName = `${newUser.firstName.trim()} ${newUser.lastName.trim()}`.trim();
    if (!fullName || !newUser.email.trim()) {
      return;
    }

    const nextUser: User = {
      id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: fullName,
      email: newUser.email,
      phone: newUser.phone || "Not provided",
      userId: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      role: newUser.role,
      institution: newUser.institution,
      department: newUser.department,
      lastLogin: "Never",
      status: "Pending",
      registeredOn: new Date().toISOString(),
      emailVerified: false,
      avatar: `${newUser.firstName[0] ?? "U"}${newUser.lastName[0] ?? "S"}`.toUpperCase(),
    };

    setUsers((previous) => [nextUser, ...previous]);
    setShowAddModal(false);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Student",
      institution: "Pimpri Chinchwad College of Engineering",
      department: "Computer Engineering",
    });
  };

  const updateUser = () => {
    if (!editingUser) return;

    const fullName = `${newUser.firstName.trim()} ${newUser.lastName.trim()}`.trim();
    if (!fullName || !newUser.email.trim()) {
      return;
    }

    setUsers((previous) =>
      previous.map((user) =>
        user.userId === editingUser.userId
          ? {
            ...user,
            name: fullName,
            email: newUser.email,
            phone: newUser.phone || "Not provided",
            role: newUser.role,
            institution: newUser.institution,
            department: newUser.department,
          }
          : user,
      ),
    );

    setModalType(null);
    setEditingUser(null);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Student",
      institution: "Pimpri Chinchwad College of Engineering",
      department: "Computer Engineering",
    });
  };

  const deleteUser = () => {
    if (!selectedUser) return;

    setUsers((previous) => previous.filter((user) => user.userId !== selectedUser.userId));
    setSelectedUser(null);
    setModalType(null);
  };

  const handleAction = (user: User, action: string) => {
    switch (action) {
      case "view":
        setSelectedUser(user);
        setModalType("view");
        break;
      case "edit":
        setSelectedUser(user);
        setEditingUser(user);
        setNewUser({
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ").slice(1).join(" "),
          email: user.email,
          phone: user.phone,
          role: user.role,
          institution: user.institution,
          department: user.department,
        });
        setModalType("edit");
        break;
      case "delete":
        setSelectedUser(user);
        setModalType("delete");
        break;
      default:
        break;
    }
  };

  const userCount = filteredUsers.length;

  return (
    <div className="space-y-6 p-1" style={{ fontFamily: "'Figtree', sans-serif" }}>
      {/* View Modal */}
      {modalType === "view" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 sm:p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-sm sm:max-w-2xl md:max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-sky-100 text-lg sm:text-xl font-bold text-sky-700">
                  {selectedUser.avatar}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{selectedUser.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <IdCard className="h-4 w-4 text-slate-500" />
                {selectedUser.userId}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <UserCog className="h-4 w-4 text-slate-500" />
                {selectedUser.role}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <Building2 className="h-4 w-4 text-slate-500" />
                {selectedUser.institution}
              </span>
              <StatusBadge status={selectedUser.status} />
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                Created {formatDate(selectedUser.registeredOn)}
              </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Personal Information
                </h3>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-500">Full Name</span>
                    <span>{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{selectedUser.phone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Organization
                </h3>
                <div className="mt-4 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span>{selectedUser.institution}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{selectedUser.department}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>{selectedUser.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalType === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-3 sm:p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-sm sm:max-w-2xl md:max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Edit user</p>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">Update account</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setEditingUser(null);
                  setNewUser({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    role: "Student",
                    institution: "Pimpri Chinchwad College of Engineering",
                    department: "Computer Engineering",
                  });
                }}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-4 sm:space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <UserPlus className="h-4 w-4" />
                  Personal Information
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>First Name</span>
                    <input
                      value={newUser.firstName}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, firstName: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-sky-400"
                      placeholder="First Name"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Last Name</span>
                    <input
                      value={newUser.lastName}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, lastName: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-sky-400"
                      placeholder="Last Name"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="name@email.com"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Phone</span>
                  <input
                    value={newUser.phone}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, phone: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="+91 98765 43210"
                  />
                </label>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <ShieldEllipsis className="h-4 w-4" />
                  Account Information
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Role</span>
                  <select
                    value={newUser.role}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Institution</span>
                  <select
                    value={newUser.institution}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, institution: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                  >
                    {institutionOptions.map((institution) => (
                      <option key={institution} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Department</span>
                  <input
                    value={newUser.department}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, department: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="Computer Engineering"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setEditingUser(null);
                  setNewUser({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    role: "Student",
                    institution: "Pimpri Chinchwad College of Engineering",
                    department: "Computer Engineering",
                  });
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateUser}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalType === "delete" && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-100 p-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">Delete User</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setModalType(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p>
                Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedUser.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteUser}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 p-3 sm:p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-sm sm:max-w-2xl md:max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Add user</p>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">Create account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-4 sm:space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <UserPlus className="h-4 w-4" />
                  Personal Information
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>First Name</span>
                    <input
                      value={newUser.firstName}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, firstName: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-sky-400"
                      placeholder="First Name"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    <span>Last Name</span>
                    <input
                      value={newUser.lastName}
                      onChange={(event) => setNewUser((prev) => ({ ...prev, lastName: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-sky-400"
                      placeholder="Last Name"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="name@email.com"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Phone</span>
                  <input
                    value={newUser.phone}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, phone: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="+91 98765 43210"
                  />
                </label>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <ShieldEllipsis className="h-4 w-4" />
                  Account Information
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Role</span>
                  <select
                    value={newUser.role}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Institution</span>
                  <select
                    value={newUser.institution}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, institution: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                  >
                    {institutionOptions.map((institution) => (
                      <option key={institution} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Department</span>
                  <input
                    value={newUser.department}
                    onChange={(event) => setNewUser((prev) => ({ ...prev, department: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-400"
                    placeholder="Computer Engineering"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createUser}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-slate-800 min-h-[40px]"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Users</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Users management</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Manage platform users, roles, account status, institutional associations, and user activity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl  bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, icon: Icon, accent }) => (
            <StatCard key={title} title={title} value={value} icon={Icon} accent={accent} />
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">

            {/* Search */}
            <div className="flex-1 min-w-0">
              <label className="mb-2 block text-xs sm:text-sm font-medium text-slate-700">
                Search
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-48">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>

              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(event.target.value as UserRole | "")
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400"
              >
                <option value="">All roles</option>

                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as UserStatus | "")
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-sky-400"
              >
                <option value="">All statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>

          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">User ID</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Institution</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600">{user.userId}</td>
                    <td className="px-4 py-4 text-slate-600">{user.email}</td>
                    <td className="px-4 py-4 text-slate-600">{user.role}</td>
                    <td className="px-4 py-4 text-slate-600">{user.institution}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(user, "view")}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(user, "edit")}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(user, "delete")}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {userCount === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-slate-500">
              <Search className="h-10 w-10 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700">No users match your filters</p>
              <p className="text-sm">Try adjusting the search or clearing the active filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}