import { useState } from "react";
import { QrCode, Download, Check, X, Clock } from "lucide-react";

type VerificationStatus = "verified" | "pending" | "failed";

interface VerificationRequest {
  id: string;
  verifier: string;
  certificate: string;
  requestedAt: string;
  status: VerificationStatus;
  timestamp: string;
}

export default function Verification() {
  const [verifications] = useState<VerificationRequest[]>([
    {
      id: "VR-2026-001",
      verifier: "ABC Technologies",
      certificate: "B.E. Computer Engineering",
      requestedAt: "12 Aug 2026",
      status: "verified",
      timestamp: "12 Aug 2026, 2:30 PM",
    },
    {
      id: "VR-2026-002",
      verifier: "XYZ Corporation",
      certificate: "Internship Certificate",
      requestedAt: "11 Aug 2026",
      status: "verified",
      timestamp: "11 Aug 2026, 10:15 AM",
    },
    {
      id: "VR-2026-003",
      verifier: "PQR Industries",
      certificate: "Cloud Computing Fundamentals",
      requestedAt: "10 Aug 2026",
      status: "pending",
      timestamp: "10 Aug 2026, 4:45 PM",
    },
    {
      id: "VR-2026-004",
      verifier: "Unknown Verifier",
      certificate: "Training Certificate",
      requestedAt: "3 Aug 2026",
      status: "failed",
      timestamp: "3 Aug 2026, 9:20 AM",
    },
  ]);

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <Check className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <X className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusLabel = (status: VerificationStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Certificate Verification</h1>
        <p className="mt-1 text-gray-600">Track verification requests from employers and organizations</p>
      </div>

      {/* Verification Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-600">Total Verifications</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{verifications.length}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-700">Verified</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {verifications.filter((v) => v.status === "verified").length}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">Failed</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {verifications.filter((v) => v.status === "failed").length}
          </p>
        </div>
      </div>

      {/* Verification Requests */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Verifier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Certificate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Requested Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {verifications.map((verification) => (
                <tr key={verification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{verification.verifier}</p>
                    <p className="text-sm text-gray-500">{verification.id}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{verification.certificate}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{verification.requestedAt}</p>
                    <p className="text-sm text-gray-500">{verification.timestamp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(verification.status)}`}>
                      {getStatusIcon(verification.status)}
                      {getStatusLabel(verification.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <QrCode className="h-4 w-4" />
                      View QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Details */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">About Certificate Verification</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">QR Code Verification</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Share QR codes with verifiers for instant blockchain verification
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Download Report</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Export verification records as PDF for your records
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
