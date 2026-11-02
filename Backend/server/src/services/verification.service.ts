import { verifyCertificateRecord } from "./certificate.service.js";

export async function verifyCertificate(
  certificateId: string,
  token: string,
) {
  return verifyCertificateRecord(certificateId, token);
}
