import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Search } from "lucide-react";
import type { VerificationHistoryItem } from "../../types/verifier";
import { MOCK_HISTORY } from "../../data/verifierMockData";

const STORAGE_KEY = "certifyvault:verifier:saved";

function SavedRecord({ item, onRemove }: { item: VerificationHistoryItem; onRemove: () => void }) {
  const statusColor =
    item.status === "verified" ? "#16A34A" :
    item.status === "review" ? "#D97706" :
    item.status === "failed" ? "#DC2626" : "#0050F5";

  return (
    <article className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#E2E6F0] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F2F8] text-brand">
        <BookmarkCheck size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-navy">{item.certificateType}</h3>
        <p className="mt-1 truncate font-mono text-xs text-[#6B7BA6]">{item.certificateId}</p>
        <p className="mt-1 truncate text-xs text-[#6B7BA6]">{item.holderName} · {item.institution}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full px-2.5 py-1 text-xs font-bold capitalize" style={{ color: statusColor, background: `${statusColor}14` }}>
          {item.status}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.certificateId} from saved`}
          className="rounded-lg px-3 py-2 text-xs font-bold text-[#6B7BA6] transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default function VerifierSavedPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
          throw new Error("Saved certificate data has an invalid format.");
        }
        setSavedIds(parsed);
      }
      setStorageReady(true);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not load saved certificates.");
      setStorageReady(true);
    }
  }, []);

  const savedRecords = useMemo(
    () => MOCK_HISTORY.filter((item) => savedIds.includes(item.id)),
    [savedIds],
  );
  const availableRecords = useMemo(
    () => MOCK_HISTORY.filter((item) => !savedIds.includes(item.id)),
    [savedIds],
  );
  const filteredSaved = savedRecords.filter((item) =>
    `${item.certificateId} ${item.certificateType} ${item.holderName} ${item.institution}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const updateSaved = (id: string, shouldSave: boolean) => {
    const next = shouldSave
      ? [...savedIds, id]
      : savedIds.filter((savedId) => savedId !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedIds(next);
      setStorageError("");
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not update saved certificates.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="mb-2 flex items-center gap-2 text-brand">
          <Bookmark size={18} />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">Saved</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy">Saved certificates</h1>
        <p className="mt-1 text-sm text-[#6B7BA6]">Keep useful verification records easy to find.</p>
      </header>

      {storageError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {storageError}
        </p>
      )}

      <section className="rounded-3xl border border-[#E2E6F0] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-navy">Your saved records</h2>
            <p className="mt-1 text-xs text-[#6B7BA6]">{savedRecords.length} saved</p>
          </div>
          {savedRecords.length > 0 && (
            <label className="flex items-center gap-2 rounded-xl border border-[#E2E6F0] px-3 py-2">
              <Search size={15} className="text-[#6B7BA6]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search saved"
                aria-label="Search saved certificates"
                className="w-40 bg-transparent text-sm text-navy outline-none placeholder:text-[#9AA6C4]"
              />
            </label>
          )}
        </div>
        {!storageReady ? (
          <p className="py-8 text-center text-sm text-[#6B7BA6]">Loading saved certificates…</p>
        ) : filteredSaved.length ? (
          <div className="space-y-3">
            {filteredSaved.map((item) => (
              <SavedRecord key={item.id} item={item} onRemove={() => updateSaved(item.id, false)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#F7F8FC] px-5 py-8 text-center">
            <Bookmark size={24} className="mx-auto mb-3 text-[#9AA6C4]" />
            <p className="font-semibold text-navy">{savedRecords.length ? "No matching records" : "No saved certificates yet"}</p>
            <p className="mt-1 text-sm text-[#6B7BA6]">
              {savedRecords.length ? "Try another search." : "Save a record below to keep it handy."}
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-bold text-navy">Recent verifications</h2>
          <p className="mt-1 text-sm text-[#6B7BA6]">Save a record to add it to your collection.</p>
        </div>
        {availableRecords.length ? availableRecords.map((item) => (
          <article key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#E2E6F0] bg-white p-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-navy">{item.certificateType}</h3>
              <p className="mt-1 truncate font-mono text-xs text-[#6B7BA6]">{item.certificateId}</p>
              <p className="mt-1 truncate text-xs text-[#6B7BA6]">{item.holderName} · {item.institution}</p>
            </div>
            <button
              type="button"
              onClick={() => updateSaved(item.id, true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E6F0] px-3 py-2 text-xs font-bold text-brand transition-colors hover:bg-[#F0F2F8]"
            >
              <Bookmark size={14} />
              Save
            </button>
          </article>
        )) : (
          <p className="rounded-2xl border border-[#E2E6F0] bg-white p-4 text-sm text-[#6B7BA6]">
            All available sample records are saved.
          </p>
        )}
      </section>
    </div>
  );
}
