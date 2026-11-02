import type { VerificationResult } from "../types/verifier";

export function downloadVerificationReport(result: VerificationResult): void {
  const report = {
    generatedAt: new Date().toISOString(),
    verification: result,
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeId = result.certificate.id.replace(/[^a-zA-Z0-9_-]/g, "-");

  anchor.href = url;
  anchor.download = `certifyvault-verification-${safeId}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
