import { db } from "../db/index.js";
import { certificates } from "../db/schema.js";

export async function verifyCertificate(certificateId: string) {
  const certificate = await db
    .select()
    .from(certificates)
    .where(certificates.certificateId.eq(certificateId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!certificate) {
    return { isValid: false, message: "Certificate not found" };
  }

  return {
    isValid: true,
    certificate,
  };
}
