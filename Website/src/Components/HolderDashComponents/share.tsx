import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { Ban, Check, Copy, Link2, Loader2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  createCredentialShareLink,
  getCredentialShareLinks,
  getHolderCredential,
  getHolderCredentials,
  revokeCredentialShareLink,
  updateCredentialSharing,
  type CredentialSharingSettings,
  type HolderCredential,
  type HolderCredentialDetail,
  type HolderShareLink,
} from "../../utils/holderApi";

const defaultSettings: CredentialSharingSettings = {
  visibility: "unlisted",
  pdfDownloadPolicy: "private",
  showRecipientName: false,
  allowStructuredExport: true,
};

function isActive(link: HolderShareLink) {
  return !link.revokedAt && new Date(link.expiresAt).getTime() > Date.now();
}

export default function Share() {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedCertificateId = searchParams.get("certificate");
  const [credentials, setCredentials] = useState<HolderCredential[]>([]);
  const [certificateId, setCertificateId] = useState(requestedCertificateId ?? "");
  const [detail, setDetail] = useState<HolderCredentialDetail | null>(null);
  const [settings, setSettings] = useState<CredentialSharingSettings>(defaultSettings);
  const [links, setLinks] = useState<HolderShareLink[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [expiry, setExpiry] = useState(7);
  const [allowPdfDownload, setAllowPdfDownload] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selectedCredential = useMemo(
    () => credentials.find((credential) => credential.certificateId === certificateId),
    [certificateId, credentials],
  );

  const loadCredentials = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const items = await getHolderCredentials(token);
      setError("");
      setCredentials(items);
      if (items.length === 0) {
        setDetail(null);
        setLinks([]);
      }
      setCertificateId((current) =>
        current && items.some((item) => item.certificateId === current)
          ? current
          : items[0]?.certificateId ?? "",
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The wallet could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadCredentials(), 0);
    return () => window.clearTimeout(timer);
  }, [loadCredentials]);

  const loadSelected = useCallback(async () => {
    if (!certificateId) {
      return;
    }
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const [credential, shareLinks] = await Promise.all([
        getHolderCredential(token, certificateId),
        getCredentialShareLinks(token, certificateId),
      ]);
      setError("");
      setDetail(credential);
      setLinks(shareLinks);
      setSettings(credential.sharing ?? defaultSettings);
      setGeneratedUrl("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Sharing settings could not be loaded.");
    }
  }, [certificateId, getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSelected(), 0);
    return () => window.clearTimeout(timer);
  }, [loadSelected]);

  const saveSettings = async (next: CredentialSharingSettings) => {
    setSettings(next);
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await updateCredentialSharing(token, certificateId, next);
      setLinks((current) => current.map((link) => ({ ...link, revokedAt: link.revokedAt ?? new Date().toISOString() })));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Sharing settings could not be saved.");
      await loadSelected();
    } finally {
      setBusy(false);
    }
  };

  const generateLink = async () => {
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const link = await createCredentialShareLink(token, certificateId, expiry, allowPdfDownload);
      setGeneratedUrl(link.url);
      setLinks(await getCredentialShareLinks(token, certificateId));
    } catch (linkError) {
      setError(linkError instanceof Error ? linkError.message : "A share link could not be created.");
    } finally {
      setBusy(false);
    }
  };

  const revokeLink = async (linkId: number) => {
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await revokeCredentialShareLink(token, certificateId, linkId);
      setLinks((current) => current.map((link) => link.id === linkId ? { ...link, revokedAt: new Date().toISOString() } : link));
      if (generatedUrl) setGeneratedUrl("");
    } catch (revokeError) {
      setError(revokeError instanceof Error ? revokeError.message : "The share link could not be revoked.");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard access was denied. Select and copy the link manually.");
    }
  };

  const updateSetting = <K extends keyof CredentialSharingSettings>(
    key: K,
    value: CredentialSharingSettings[K],
  ) => {
    void saveSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return <main className="flex justify-center px-6 py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0050F5]" aria-label="Loading sharing settings" /></main>;
  }

  return (
    <main className="mx-auto max-w-[900px] px-6 py-8 lg:px-10">
      <h1 className="mb-1 text-[24px] font-semibold tracking-tight text-[#000F3E]">Share Credential</h1>
      <p className="mb-7 text-[14px] text-[#6B7494]">Manage public visibility, private download access, and revocable share links.</p>
      {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {!credentials.length ? (
        <p className="rounded-2xl border border-dashed border-[#DCE6FB] bg-white py-16 text-center text-sm text-[#8993B4]">Claim a credential before configuring sharing.</p>
      ) : (
        <>
          <label className="mb-5 block text-sm font-medium text-[#000F3E]">
            Credential
            <select value={certificateId} onChange={(event) => setCertificateId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-3 text-sm">
              {credentials.map((credential) => <option key={credential.claimId} value={credential.certificateId}>{credential.title} · {credential.certificateId}</option>)}
            </select>
          </label>

          <section className="rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8993B4]">Credential privacy</h2>
            <label className="mt-5 block text-sm font-medium text-[#4A5578]">
              Public page visibility
              <select value={settings.visibility} disabled={busy} onChange={(event) => updateSetting("visibility", event.target.value as CredentialSharingSettings["visibility"])} className="mt-2 w-full rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-3">
                <option value="private">Private — share links only</option>
                <option value="unlisted">Unlisted — anyone with the credential URL</option>
                <option value="public">Public — publicly accessible</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-[#4A5578]">
              PDF download policy
              <select value={settings.pdfDownloadPolicy} disabled={busy} onChange={(event) => updateSetting("pdfDownloadPolicy", event.target.value as CredentialSharingSettings["pdfDownloadPolicy"])} className="mt-2 w-full rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-3">
                <option value="private">Private — wallet only</option>
                <option value="link">Allow only share links marked for PDF access</option>
                <option value="public">Allow public downloads</option>
              </select>
            </label>
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3 text-sm text-[#4A5578]"><input type="checkbox" checked={settings.showRecipientName} disabled={busy} onChange={(event) => updateSetting("showRecipientName", event.target.checked)} className="h-4 w-4 accent-[#0050F5]" />Show my name on public verification</label>
              <label className="flex items-center gap-3 text-sm text-[#4A5578]"><input type="checkbox" checked={settings.allowStructuredExport} disabled={busy} onChange={(event) => updateSetting("allowStructuredExport", event.target.checked)} className="h-4 w-4 accent-[#0050F5]" />Allow structured credential export</label>
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8993B4]">Create temporary share link</h2>
            <p className="mt-2 text-sm text-[#6B7494]">{selectedCredential?.title ?? detail?.certificate.title}</p>
            <div className="mt-5 flex flex-wrap items-end gap-4">
              <label className="text-sm font-medium text-[#4A5578]">Expires after
                <select value={expiry} disabled={busy} onChange={(event) => setExpiry(Number(event.target.value))} className="mt-2 block rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-3">
                  {[1, 7, 14, 30].map((days) => <option key={days} value={days}>{days} days</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 pb-3 text-sm text-[#4A5578]"><input type="checkbox" checked={allowPdfDownload} disabled={busy} onChange={(event) => setAllowPdfDownload(event.target.checked)} className="h-4 w-4 accent-[#0050F5]" />Allow PDF download on this link</label>
            </div>
            <button type="button" disabled={busy || !certificateId} onClick={() => void generateLink()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0050F5] py-3.5 text-sm font-semibold text-white hover:bg-[#0041CC] disabled:opacity-50">
              <Link2 className="h-4 w-4" />Generate secure link
            </button>
            {generatedUrl && (
              <div className="mt-5 rounded-xl bg-[#F7F9FF] p-4">
                <div className="flex items-center gap-2">
                  <input readOnly value={generatedUrl} aria-label="Generated credential share link" className="min-w-0 flex-1 bg-transparent text-sm text-[#000F3E] outline-none" />
                  <button type="button" onClick={() => void copyLink()} className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#0050F5]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</button>
                  <button type="button" onClick={() => setShowQr((value) => !value)} aria-expanded={showQr} className="rounded-lg p-2 text-[#0050F5]" aria-label="Toggle QR code"><QrCode className="h-4 w-4" /></button>
                </div>
                {showQr && <div className="mt-4 flex justify-center"><QRCodeSVG value={generatedUrl} size={180} level="M" includeMargin /></div>}
              </div>
            )}
          </section>

          <section className="mb-10 mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#8993B4]">Share links</h2>
            {links.length === 0 ? <p className="rounded-xl bg-white px-4 py-5 text-sm text-[#8993B4]">No share links have been created.</p> : (
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <div key={link.id} className="flex flex-col gap-3 rounded-2xl border border-[#EAF1FF] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-sm font-semibold text-[#000F3E]">Created {new Date(link.createdAt).toLocaleString()}</p><p className="mt-1 text-xs text-[#6B7494]">Expires {new Date(link.expiresAt).toLocaleString()} · PDF {link.allowPdfDownload ? "allowed" : "not allowed"}</p></div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isActive(link) ? "bg-[#E8F9EF] text-[#1AAE5F]" : "bg-[#F0F3FC] text-[#8993B4]"}`}>{isActive(link) ? "Active" : link.revokedAt ? "Revoked" : "Expired"}</span>
                      {isActive(link) && <button type="button" disabled={busy} onClick={() => void revokeLink(link.id)} className="flex items-center gap-1.5 rounded-lg border border-[#F6D6D7] px-3 py-1.5 text-xs font-medium text-[#E5484D] hover:bg-[#FDEDEE] disabled:opacity-50"><Ban className="h-3.5 w-3.5" />Revoke</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
