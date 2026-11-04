import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { KeyRound, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import {
  createPasskeyAuthenticationOptions,
  createPasskeyRegistrationOptions,
  listPasskeys,
  revokePasskey,
  verifyPasskeyAuthentication,
  verifyPasskeyRegistration,
  type PasskeyRecord,
} from "../../utils/passkeyApi";

export default function HolderSecurity() {
  const { getToken } = useAuth();
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>([]);
  const [deviceName, setDeviceName] = useState("");
  const [supported] = useState(() => browserSupportsWebAuthn());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPasskeys = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const items = await listPasskeys(token);
      setError("");
      setPasskeys(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Passkeys could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPasskeys(), 0);
    return () => window.clearTimeout(timer);
  }, [loadPasskeys]);

  const register = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const options = await createPasskeyRegistrationOptions(token);
      const response = await startRegistration({ optionsJSON: options });
      await verifyPasskeyRegistration(token, response, deviceName.trim());
      setDeviceName("");
      setNotice("Passkey registered. You can now use it for an additional account verification step.");
      await loadPasskeys();
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : "Passkey registration failed.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const options = await createPasskeyAuthenticationOptions(token);
      const response = await startAuthentication({ optionsJSON: options });
      await verifyPasskeyAuthentication(token, response);
      setNotice("Passkey verification succeeded.");
      await loadPasskeys();
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Passkey verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id: number) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await revokePasskey(token, id);
      setNotice("Passkey revoked.");
      await loadPasskeys();
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "Passkey could not be revoked.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8 lg:px-10">
      <header><h1 className="text-2xl font-semibold text-[#000F3E]">Account security</h1><p className="mt-1 text-sm text-[#6B7494]">Register and manage WebAuthn passkeys for additional verification. CertifyVault sign-in remains protected by your account identity provider.</p></header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {!supported && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">This browser does not support WebAuthn passkeys.</p>}

      <section className="rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-[#EAF1FF] p-3 text-[#0050F5]"><KeyRound className="h-5 w-5" /></span><div><h2 className="font-semibold text-[#000F3E]">Add a passkey</h2><p className="mt-1 text-sm text-[#6B7494]">Use a device screen lock, biometric check, or security key to register.</p></div></div>
        <label className="mt-5 block text-sm font-medium text-[#4A5578]">Device label (optional)<input maxLength={100} value={deviceName} onChange={(event) => setDeviceName(event.target.value)} placeholder="e.g. Personal laptop" className="mt-2 w-full rounded-xl border border-[#E4EAFB] px-3.5 py-3" /></label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" disabled={!supported || busy} onClick={() => void register()} className="flex items-center gap-2 rounded-xl bg-[#0050F5] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Register passkey</button>
          <button type="button" disabled={!supported || busy || passkeys.every((passkey) => passkey.revokedAt !== null)} onClick={() => void verify()} className="flex items-center gap-2 rounded-xl border border-[#DCE6FB] px-4 py-3 text-sm font-semibold text-[#000F3E] disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Verify with passkey</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#EAF1FF] bg-white shadow-sm">
        <div className="border-b border-[#EDF1FA] px-5 py-4"><h2 className="font-semibold text-[#000F3E]">Registered passkeys</h2></div>
        {loading ? <div className="flex justify-center p-10"><Loader2 className="h-5 w-5 animate-spin text-[#0050F5]" /></div> : passkeys.length === 0 ? <p className="p-8 text-center text-sm text-[#8993B4]">No passkeys registered.</p> : (
          <div className="divide-y divide-[#EDF1FA]">
            {passkeys.map((passkey) => (
              <article key={passkey.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-medium text-[#000F3E]">{passkey.deviceName || "Unnamed passkey"}</h3><p className="mt-1 text-xs text-[#6B7494]">Added {new Date(passkey.createdAt).toLocaleString()}{passkey.lastUsedAt ? ` · Last used ${new Date(passkey.lastUsedAt).toLocaleString()}` : ""}</p></div>
                {passkey.revokedAt ? <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Revoked</span> : <button type="button" disabled={busy} onClick={() => void revoke(passkey.id)} className="flex w-fit items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Revoke</button>}
              </article>
            ))}
          </div>
        )}
      </section>
      <p className="text-xs leading-5 text-[#8993B4]">If you lose all registered passkeys, recover access through your account provider and revoke lost authenticators here. Passkeys do not replace account recovery.</p>
    </main>
  );
}
