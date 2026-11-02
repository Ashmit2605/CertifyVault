import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { renderCertificatePdf } from "./certificate-template.service.js";

test("certificate PDF rendering returns the final PDF bytes for hashing", async () => {
  const pdf = await renderCertificatePdf({
    certificateId: "CV-2026-0123456789ABCDEF",
    certificateNumber: null,
    certificateType: "degree",
    title: "Bachelor of Science",
    studentName: "Example Student",
    course: "Computer Science",
    grade: "8.5",
    issueDate: "2026-06-01",
    institutionName: "Example University",
    issuerName: "Authorized Issuer",
    verificationUrl: "https://example.test/verify?token=signed",
  });

  assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.equal(createHash("sha256").update(pdf).digest("hex").length, 64);
});
