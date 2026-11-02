export interface HolderCertificate {
  id: string;
  title: string;
  issuer: string;
  icon: string;
  status: "Verified" | "Revoked";
  issued: string;
  type: string;
}

export const HOLDER_CERTIFICATES: HolderCertificate[] = [
  {
    id: "CV-2026-001245",
    title: "B.E. Computer Engineering",
    issuer: "PCCOER",
    icon: "🎓",
    status: "Verified",
    issued: "June 2026",
    type: "Degree",
  },
  {
    id: "CV-2026-000987",
    title: "Internship Certificate",
    issuer: "ABC Technologies",
    icon: "💼",
    status: "Verified",
    issued: "May 2026",
    type: "Internship",
  },
  {
    id: "CV-2025-004521",
    title: "Data Structures & Algorithms",
    issuer: "NPTEL",
    icon: "📘",
    status: "Verified",
    issued: "Dec 2025",
    type: "Course",
  },
  {
    id: "CV-2025-003310",
    title: "Cloud Computing Fundamentals",
    issuer: "AWS Academy",
    icon: "☁️",
    status: "Verified",
    issued: "Oct 2025",
    type: "Training",
  },
  {
    id: "CV-2025-002187",
    title: "Hackathon Winner — SIH 2025",
    issuer: "Smart India Hackathon",
    icon: "🏆",
    status: "Verified",
    issued: "Sep 2025",
    type: "Other",
  },
  {
    id: "CV-2024-009911",
    title: "Web Development Bootcamp",
    issuer: "XYZ Corp",
    icon: "💻",
    status: "Revoked",
    issued: "Jan 2024",
    type: "Training",
  },
];
