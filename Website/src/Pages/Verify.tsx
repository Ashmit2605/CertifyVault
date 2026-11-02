import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { verifyCertificateByQr, type CertificateVerificationResult } from "../utils/certificateApi";

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let id = certificateId.trim();
      let token = qrToken.trim();
      if (token.startsWith("http://") || token.startsWith("https://")) {
        const url = new URL(token);
        token = url.searchParams.get("token") ?? "";
        id ||= decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? "");
      }
      if (!id || !token) {
        throw new Error("Enter a certificate ID and signed QR token or paste the complete QR verification URL.");
      }
      setResult(await verifyCertificateByQr(id, token));
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Certificate verification failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCertificateId("");
    setQrToken("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen pb-20 pt-28" style={{ background: "var(--bg-2)" }}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: "var(--blue)" }}>
            VERIFICATION
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy">
            Verify a Certificate
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Verify the signed QR token against the issuer record and blockchain proof.
          </p>
        </motion.div>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          {!result ? (
            <div className="mx-auto max-w-xl space-y-4">
              <div className="flex items-center gap-3">
                <QrCode size={24} className="text-brand" />
                <div>
                  <h2 className="font-semibold text-navy">Scan or paste a certificate QR</h2>
                  <p className="text-xs text-slate-500">
                    QR contains a signed verification URL; no personal data is embedded in the token.
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="certificate-id" className="mb-1.5 block text-sm font-medium text-navy">
                  Certificate ID
                </label>
                <input
                  id="certificate-id"
                  value={certificateId}
                  onChange={(event) => setCertificateId(event.target.value)}
                  placeholder="CV-2026-…"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label htmlFor="qr-token" className="mb-1.5 block text-sm font-medium text-navy">
                  Signed token or complete QR URL
                </label>
                <textarea
                  id="qr-token"
                  value={qrToken}
                  onChange={(event) => setQrToken(event.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="Paste the signed token or the URL encoded in the certificate QR"
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => void verify()}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
              >
                {loading ? <Loader2 size={17} className="animate-spin" /> : <ShieldCheck size={17} />}
                {loading ? "Checking signature and proof…" : "Verify certificate"}
              </button>
            </div>
          ) : (
            <div>
              <div
                className={`flex items-center gap-3 rounded-2xl p-4 ${
                  result.valid ? "bg-emerald-50" : "bg-amber-50"
                }`}
              >
                {result.valid ? (
                  <CheckCircle size={24} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={24} className="text-amber-600" />
                )}
                <div>
                  <p className={`font-semibold ${result.valid ? "text-emerald-700" : "text-amber-800"}`}>
                    {result.valid ? "Certificate verified" : "Certificate not verified"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Status: {result.status.replaceAll("_", " ")}
                  </p>
                </div>
              </div>
              {result.certificate && (
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Certificate ID</dt>
                    <dd className="break-all text-sm font-medium text-navy">
                      {result.certificate.certificateId}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Institution</dt>
                    <dd className="text-sm font-medium text-navy">
                      {result.certificate.institutionName ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Student</dt>
                    <dd className="text-sm font-medium text-navy">
                      {result.certificate.studentName}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Qualification</dt>
                    <dd className="text-sm font-medium text-navy">
                      {result.certificate.title} · {result.certificate.course}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Issue date</dt>
                    <dd className="text-sm font-medium text-navy">
                      {result.certificate.issueDate ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs text-slate-500">Blockchain network</dt>
                    <dd className="text-sm font-medium text-navy">
                      {result.certificate.blockchainNetwork ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                    <dt className="text-xs text-slate-500">SHA-256 of original PDF</dt>
                    <dd className="break-all font-mono text-xs text-navy">
                      {result.certificate.certificateHash}
                    </dd>
                  </div>
                  {result.certificate.blockchainTxHash && (
                    <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                      <dt className="text-xs text-slate-500">Blockchain transaction</dt>
                      <dd className="break-all font-mono text-xs text-navy">
                        {result.certificate.blockchainTxHash}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-navy hover:bg-slate-50"
              >
                Verify another certificate
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
