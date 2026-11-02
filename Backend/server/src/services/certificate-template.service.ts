import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export interface CertificateDocumentData {
  certificateId: string;
  certificateNumber: string | null;
  certificateType: string;
  title: string;
  studentName: string;
  course: string;
  grade: string | null;
  issueDate: string;
  institutionName: string;
  issuerName: string;
  verificationUrl: string;
}

export async function renderCertificatePdf(
  data: CertificateDocumentData,
): Promise<Buffer> {
  const qrCode = await QRCode.toBuffer(data.verificationUrl, {
    errorCorrectionLevel: "Q",
    margin: 1,
    width: 300,
  });

  return new Promise((resolve, reject) => {
    const document = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 42, right: 52, bottom: 42, left: 52 },
      info: {
        Title: data.title,
        Author: data.institutionName,
        Subject: `Certificate ${data.certificateId}`,
      },
    });
    const chunks: Buffer[] = [];

    document.on("data", (chunk: Buffer | Uint8Array) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    document.once("error", reject);
    document.once("end", () => resolve(Buffer.concat(chunks)));

    const { width, height } = document.page;
    document
      .lineWidth(2)
      .strokeColor("#1d4ed8")
      .roundedRect(26, 26, width - 52, height - 52, 12)
      .stroke();
    document
      .lineWidth(0.7)
      .strokeColor("#93c5fd")
      .roundedRect(36, 36, width - 72, height - 72, 9)
      .stroke();

    document
      .fillColor("#1e3a8a")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(data.institutionName, 82, 62, {
        align: "center",
        width: width - 164,
        lineBreak: false,
        ellipsis: true,
      });

    document
      .fillColor("#64748b")
      .font("Helvetica")
      .fontSize(10)
      .text(data.certificateType.toUpperCase(), 82, 98, {
        align: "center",
        width: width - 164,
      });
    document
      .fillColor("#0f172a")
      .font("Helvetica-Bold")
      .fontSize(27)
      .text(data.title, 82, 122, {
        align: "center",
        width: width - 164,
        height: 68,
        ellipsis: true,
      });
    document
      .fillColor("#475569")
      .font("Helvetica")
      .fontSize(14)
      .text("This is to certify that", 82, 205, {
        align: "center",
        width: width - 164,
      });
    document
      .fillColor("#1d4ed8")
      .font("Helvetica-Bold")
      .fontSize(24)
      .text(data.studentName, 82, 230, {
        align: "center",
        width: width - 164,
        height: 62,
        ellipsis: true,
      });
    document
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(14)
      .text(`has completed ${data.course}`, 82, 300, {
        align: "center",
        width: width - 164,
        height: 44,
        ellipsis: true,
      });

    if (data.grade) {
      document
        .fillColor("#475569")
        .fontSize(11)
        .text(`Grade / CGPA: ${data.grade}`, 82, 350, {
          align: "center",
          width: width - 164,
          ellipsis: true,
        });
    }

    document
      .moveTo(82, height - 106)
      .lineTo(width - 186, height - 106)
      .lineWidth(0.7)
      .strokeColor("#cbd5e1")
      .stroke();
    document
      .fillColor("#334155")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(data.issuerName, 82, height - 94, {
        width: 250,
        ellipsis: true,
      });
    document
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#64748b")
      .text(`Authorized issuer · ${data.issueDate}`, 82, height - 78, {
        width: 250,
        ellipsis: true,
      });
    document
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#475569")
      .text(
        `Certificate ID: ${data.certificateId}${
          data.certificateNumber
            ? ` · Certificate number: ${data.certificateNumber}`
            : ""
        }`,
        82,
        height - 55,
        {
        width: 300,
        ellipsis: true,
        },
      );

    document.image(qrCode, width - 160, height - 162, {
      width: 88,
      height: 88,
    });
    document
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#64748b")
      .text("Scan to verify", width - 174, height - 68, {
        width: 116,
        align: "center",
      });

    document.end();
  });
}
