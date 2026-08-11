import { db } from "../db/index.js";
import { certificates } from "../db/schema.js";

export async function createCertificate(payload: any) {
  const [certificate] = await db
    .insert(certificates)
    .values({
      certificateId: payload.certificateId,
      studentName: payload.studentName,
      course: payload.course,
      certificateHash: payload.certificateHash,
      blockchainTxHash: payload.blockchainTxHash,
    })
    .returning();

  return certificate;
}

export async function lookupCertificate(certificateId: string) {
  return db
    .select()
    .from(certificates)
    .where(certificates.certificateId.eq(certificateId))
    .limit(1)
    .then((rows) => rows[0]);
}
