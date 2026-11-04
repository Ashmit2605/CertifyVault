import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { CheckCircle2, Loader2, Plus, ShieldCheck } from "lucide-react";
import {
  createIssuerRecipientRecord,
  listIssuerRecipients,
  verifyIssuerRecipientRecord,
  type IssuerRecipient,
} from "../../../utils/issuerLifecycleApi";

export default function IssuerRecipients() {
  const { getToken } = useAuth();
  const [recipients, setRecipients] = useState<IssuerRecipient[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [evidence, setEvidence] = useState("");
  const [confirmContact, setConfirmContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRecipients = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const items = await listIssuerRecipients(token);
      setError("");
      setRecipients(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Recipient records could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadRecipients(), 0);
    return () => window.clearTimeout(timer);
  }, [loadRecipients]);

  const createRecipient = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await createIssuerRecipientRecord(token, {
        recipientName: name.trim(),
        email: email.trim() || null,
        institutionReference: reference.trim() || null,
      });
      setName("");
      setEmail("");
      setReference("");
      setNotice("Recipient record created.");
      await loadRecipients();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Recipient could not be created.");
    } finally {
      setBusy(false);
    }
  };

  const verifyContact = async (recipientId: number) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await verifyIssuerRecipientRecord(token, recipientId, evidence.trim());
      setEvidence("");
      setConfirmContact(false);
      setNotice("Recipient email attestation recorded.");
      await loadRecipients();
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Contact verification could not be recorded.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header><h1 className="text-2xl font-semibold text-navy">Recipient records</h1><p className="mt-1 text-sm text-slate-500">Manage institutional recipient identities and attest contact information before claim invitations.</p></header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <form onSubmit={(event) => void createRecipient(event)} className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Add recipient</h2>
        <label className="text-sm font-medium text-navy">Name<input required maxLength={255} value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-lg bg-slate-50 px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-medium text-navy">Institution reference<input maxLength={255} value={reference} onChange={(event) => setReference(event.target.value)} className="mt-1.5 w-full rounded-lg bg-slate-50 px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-medium text-navy">Email (optional)<input type="email" maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg bg-slate-50 px-3 py-2.5 font-normal" /></label>
        <div className="flex items-end"><button type="submit" disabled={busy || !name.trim()} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"><Plus size={16} />Create recipient</button></div>
      </form>

      {recipients.some((recipient) => recipient.email && !recipient.emailVerifiedAt) && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <label className="block text-sm font-medium text-amber-950">Verification evidence<textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} minLength={10} maxLength={1000} placeholder="Describe the institution-held source used to confirm the recipient email." className="mt-2 w-full rounded-lg border border-amber-200 bg-white p-3 text-sm" /></label>
          <label className="mt-3 flex items-start gap-2 text-sm text-amber-900"><input type="checkbox" checked={confirmContact} onChange={(event) => setConfirmContact(event.target.checked)} className="mt-1 accent-brand" />I verified the recipient email against institution-held records.</label>
          <p className="mt-2 text-xs text-amber-800">Choose the corresponding recipient below to record this attestation.</p>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-navy">Recipients</h2></div>
        {loading ? <div className="flex justify-center p-10"><Loader2 className="h-5 w-5 animate-spin text-brand" /></div> : recipients.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No recipient records yet.</p> : (
          <div className="divide-y divide-slate-100">
            {recipients.map((recipient) => (
              <article key={recipient.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-medium text-navy">{recipient.recipientName}</h3><p className="mt-1 text-sm text-slate-500">{recipient.email ?? "No email"}{recipient.institutionReference ? ` · Ref: ${recipient.institutionReference}` : ""}</p></div>
                <div className="flex flex-wrap items-center gap-3">
                  {recipient.emailVerifiedAt ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"><ShieldCheck size={14} />Email attested</span> : recipient.email ? <span className="text-xs text-amber-700">Email not verified</span> : <span className="text-xs text-slate-400">Add email before inviting</span>}
                  {recipient.email && !recipient.emailVerifiedAt && (
                    <button type="button" disabled={busy || !confirmContact || evidence.trim().length < 10} onClick={() => void verifyContact(recipient.id)} className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-medium text-amber-900 disabled:opacity-40">Attest this email</button>
                  )}
                  {recipient.emailVerifiedAt && <CheckCircle2 size={16} className="text-emerald-600" aria-label="Verified recipient email" />}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
