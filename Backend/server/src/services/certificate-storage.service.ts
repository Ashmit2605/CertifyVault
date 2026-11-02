import { createHash, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

function getStorageRoot() {
  return path.resolve(
    process.env.CERTIFICATE_STORAGE_PATH ??
      path.join(process.cwd(), "private-certificates"),
  );
}

function getFilePath(storageKey: string) {
  if (!/^certificates\/CV-[A-Z0-9-]+\.pdf$/.test(storageKey)) {
    throw new Error("Certificate storage key is invalid.");
  }

  const root = getStorageRoot();
  const filePath = path.resolve(root, storageKey);
  if (!filePath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Certificate storage key is invalid.");
  }
  return { root, filePath };
}

export async function storeCertificatePdf(
  storageKey: string,
  pdf: Buffer,
): Promise<void> {
  const { root, filePath } = getFilePath(storageKey);
  await mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await mkdir(root, { recursive: true, mode: 0o700 });
  await writeFile(filePath, pdf, { flag: "wx", mode: 0o600 });
}

export async function readCertificatePdf(
  storageKey: string,
  expectedHash: string,
): Promise<Buffer> {
  const { filePath } = getFilePath(storageKey);
  const pdf = await readFile(filePath);
  const actualHash = createHash("sha256").update(pdf).digest();
  const expected = Buffer.from(expectedHash, "hex");
  if (
    expected.length !== actualHash.length ||
    !timingSafeEqual(actualHash, expected)
  ) {
    throw new Error("Stored certificate failed its SHA-256 integrity check.");
  }
  return pdf;
}

export async function removeCertificatePdf(storageKey: string): Promise<void> {
  const { filePath } = getFilePath(storageKey);
  await rm(filePath, { force: true });
}
