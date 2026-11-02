import { useState } from "react";
import { Search, ShieldCheck, ShieldOff, Eye, Share2 } from "lucide-react";
import { HOLDER_CERTIFICATES } from "../../data/holderMockData";
import { Link } from "react-router-dom";

const FILTERS = ["All", "Degree", "Course", "Internship", "Training", "Other"];

export default function MyCertificates() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);

  const filtered = HOLDER_CERTIFICATES.filter((c) => {
    const matchesFilter = filter === "All" || c.type === filter;
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.issuer.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  const selectedCertificate = HOLDER_CERTIFICATES.find((certificate) => certificate.id === selectedCertificateId);

  return (
    <>
    <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-[#000F3E]">
              My Certificates
            </h1>
            <p className="mt-1 text-[14px] text-[#6B7494]">
              Your digital credential wallet — {HOLDER_CERTIFICATES.length} credentials
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-2.5 text-[#8993B4] sm:w-72">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search certificates..."
              className="w-full bg-transparent text-[13.5px] text-[#000F3E] placeholder:text-[#9AA3C2] focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                filter === f
                  ? "bg-[#0050F5] text-white"
                  : "border border-[#E4EAFB] bg-white text-[#4A5578] hover:bg-[#F5F8FF]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCE6FB] bg-white py-16 text-center">
            <p className="text-[14.5px] text-[#8993B4]">
              No certificates match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="flex flex-col rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-[0_1px_2px_rgba(0,15,62,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,15,62,0.07)]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FF] text-[22px]">
                    {c.icon}
                  </span>
                  {c.status === "Verified" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F9EF] px-2.5 py-1 text-[11.5px] font-medium text-[#1AAE5F]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FDEDEE] px-2.5 py-1 text-[11.5px] font-medium text-[#E5484D]">
                      <ShieldOff className="h-3.5 w-3.5" />
                      Revoked
                    </span>
                  )}
                </div>

                <h3 className="text-[15.5px] font-semibold leading-snug text-[#000F3E]">
                  {c.title}
                </h3>
                <p className="mt-0.5 text-[13.5px] text-[#6B7494]">{c.issuer}</p>
                <p className="mt-2 text-[12px] text-[#9AA3C2]">
                  Issued: {c.issued}
                </p>
                <p className="text-[11.5px] text-[#B3BAD4]">{c.id}</p>

                <div className="mt-5 flex gap-2.5 border-t border-[#F0F3FC] pt-4">
                  <button
                    onClick={() => setSelectedCertificateId(c.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DCE6FB] py-2.5 text-[13px] font-medium text-[#000F3E] hover:bg-[#F5F8FF]"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <Link
                    to={`/holderdashboard/share?certificate=${encodeURIComponent(c.id)}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0050F5] py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#0041CC]"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedCertificateId(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-details-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="certificate-details-title" className="text-lg font-semibold text-[#000F3E]">
                  Certificate details
                </h2>
                <p className="mt-1 text-sm text-[#6B7494]">{selectedCertificate.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertificateId(null)}
                className="rounded-lg px-3 py-1 text-sm text-[#4A5578] hover:bg-[#F5F8FF]"
              >
                Close
              </button>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-[#8993B4]">Certificate ID</dt><dd className="font-medium text-[#000F3E]">{selectedCertificate.id}</dd></div>
              <div><dt className="text-[#8993B4]">Institution</dt><dd className="font-medium text-[#000F3E]">{selectedCertificate.issuer}</dd></div>
              <div><dt className="text-[#8993B4]">Issued</dt><dd className="font-medium text-[#000F3E]">{selectedCertificate.issued}</dd></div>
              <div><dt className="text-[#8993B4]">Status</dt><dd className="font-medium text-[#000F3E]">{selectedCertificate.status}</dd></div>
            </dl>
            <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Original certificate files are not included in this frontend demo.
            </p>
          </section>
        </div>
      )}
    </>
  );
}