import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  getAdminAccounts,
  setAccountActivation,
  type AdminAccount,
} from "../../utils/authApi";

type Props = {
  role: AdminAccount["role"];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AccountApprovals({ role }: Props) {
  const { getToken } = useAuth();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AdminAccount | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    void (async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        if (!token) throw new Error("Unable to establish a secure session.");
        const results = await getAdminAccounts(token, role);
        if (active) setAccounts(results);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load accounts for review.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [getToken, reloadKey, role]);

  const visibleAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return accounts;
    return accounts.filter((account) =>
      [
        account.firstName,
        account.lastName,
        account.email,
        account.institutionName ?? "",
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [accounts, search]);

  const pendingCount = accounts.filter((account) => !account.isActive).length;
  const activeCount = accounts.length - pendingCount;
  const roleLabel = role === "issuer" ? "Issuer" : "Verifier";

  const updateActivation = async (account: AdminAccount) => {
    setSaving(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Unable to establish a secure session.");
      const updated = await setAccountActivation(
        token,
        account.clerkId,
        !account.isActive,
      );
      setAccounts((current) =>
        current.map((item) => (item.clerkId === updated.clerkId ? updated : item)),
      );
      setSelectedAccount(updated);
    } catch (activationError) {
      setError(
        activationError instanceof Error
          ? activationError.message
          : "Unable to update account activation.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Account review
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {roleLabel} accounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review the registration details provided and manage dashboard activation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Total {roleLabel.toLowerCase()}s</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : accounts.length}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-800">Awaiting approval</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">
            {loading ? "—" : pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-800">Activated</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">
            {loading ? "—" : activeCount}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${roleLabel.toLowerCase()} accounts...`}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Account</th>
                {role === "issuer" && <th className="px-5 py-3">Institution</th>}
                <th className="px-5 py-3">Registered</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={role === "issuer" ? 5 : 4} className="px-5 py-12 text-center text-slate-500">
                    Loading accounts...
                  </td>
                </tr>
              ) : visibleAccounts.length === 0 ? (
                <tr>
                  <td colSpan={role === "issuer" ? 5 : 4} className="px-5 py-12 text-center text-slate-500">
                    {accounts.length === 0
                      ? `No ${roleLabel.toLowerCase()} accounts to review yet.`
                      : "No accounts match your search."}
                  </td>
                </tr>
              ) : (
                visibleAccounts.map((account) => (
                  <tr key={account.clerkId} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {account.firstName} {account.lastName}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={12} />
                        {account.email}
                      </p>
                    </td>
                    {role === "issuer" && (
                      <td className="px-5 py-4 text-slate-600">
                        {account.institutionName || "Not provided"}
                      </td>
                    )}
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(account.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          account.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {account.isActive ? <BadgeCheck size={13} /> : <ShieldCheck size={13} />}
                        {account.isActive ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccount(account);
                          setError("");
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Review details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setSelectedAccount(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-review-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {roleLabel} registration
                </p>
                <h2 id="account-review-title" className="mt-1 text-xl font-bold text-slate-900">
                  Review account details
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close account details"
                onClick={() => setSelectedAccount(null)}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <UserRound size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs font-medium text-slate-500">Full name</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {selectedAccount.firstName} {selectedAccount.lastName}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs font-medium text-slate-500">Email</dt>
                  <dd className="mt-0.5 break-all text-sm font-semibold text-slate-900">
                    {selectedAccount.email}
                  </dd>
                </div>
              </div>
              {role === "issuer" && (
                <div className="flex items-start gap-3">
                  <Building2 size={17} className="mt-0.5 text-slate-400" />
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Institution</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                      {selectedAccount.institutionName || "Not provided"}
                    </dd>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <CalendarDays size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs font-medium text-slate-500">Registration date</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {formatDate(selectedAccount.createdAt)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs font-medium text-slate-500">Activation status</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                    {selectedAccount.isActive ? "Active" : "Pending administrator approval"}
                  </dd>
                </div>
              </div>
            </dl>

            <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
              Review the registration information above before changing this account&apos;s
              dashboard access.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void updateActivation(selectedAccount)}
                disabled={saving}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                  selectedAccount.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {selectedAccount.isActive ? <X size={16} /> : <Check size={16} />}
                {saving
                  ? "Saving..."
                  : selectedAccount.isActive
                    ? "Deactivate account"
                    : "Approve activation"}
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
