import React, { useMemo, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  Clock,
  Ban,
  FileText,
  Eye,
  Pencil,
  Trash2,
  XCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  UserCog,
  AlertTriangle,
  Filter,
  RotateCcw,
  Inbox,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type InstitutionStatus = 'Active' | 'Pending' | 'Suspended' | 'Rejected';
type InstitutionType = 'University' | 'College' | 'Institute' | 'Training Institution';

interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  city: string;
  state: string;
  country: string;
  email: string;
  contact: string;
  address: string;
  issuers: number;
  certificates: number;
  status: InstitutionStatus;
  registeredOn: string;
  adminName: string;
  adminEmail: string;
  adminContact: string;
}

type ToastType = 'success' | 'info' | 'error';
interface ToastMsg {
  type: ToastType;
  text: string;
}

/* ================================================================== */
/*  Mock data                                                          */
/* ================================================================== */

const MOCK_INSTITUTIONS: Institution[] = [
  mkInstitution({
    id: 'INS-0001',
    name: 'Pimpri Chinchwad College of Engineering',
    type: 'College',
    city: 'Pune',
    issuers: 8,
    certificates: 2450,
    status: 'Active',
    registeredOn: '12 Jan 2026',
  }),
  mkInstitution({
    id: 'INS-0002',
    name: 'COEP Technological University',
    type: 'University',
    city: 'Pune',
    issuers: 14,
    certificates: 5210,
    status: 'Active',
    registeredOn: '03 Feb 2025',
  }),
  mkInstitution({
    id: 'INS-0003',
    name: 'Fergusson College',
    type: 'College',
    city: 'Pune',
    issuers: 5,
    certificates: 1120,
    status: 'Pending',
    registeredOn: '28 Jul 2026',
  }),
  mkInstitution({
    id: 'INS-0004',
    name: 'Symbiosis Institute of Technology',
    type: 'Institute',
    city: 'Pune',
    issuers: 6,
    certificates: 980,
    status: 'Active',
    registeredOn: '15 Mar 2025',
  }),
  mkInstitution({
    id: 'INS-0005',
    name: 'MIT World Peace University',
    type: 'University',
    city: 'Pune',
    issuers: 11,
    certificates: 3760,
    status: 'Active',
    registeredOn: '09 Sep 2024',
  }),
  mkInstitution({
    id: 'INS-0006',
    name: 'Sinhgad Skill Development Academy',
    type: 'Training Institution',
    city: 'Pune',
    issuers: 3,
    certificates: 410,
    status: 'Suspended',
    registeredOn: '21 Nov 2025',
  }),
  mkInstitution({
    id: 'INS-0007',
    name: 'Vishwakarma Institute of Information Technology',
    type: 'Institute',
    city: 'Pune',
    issuers: 7,
    certificates: 1690,
    status: 'Active',
    registeredOn: '30 Apr 2025',
  }),
  mkInstitution({
    id: 'INS-0008',
    name: 'Northline Career Academy',
    type: 'Training Institution',
    city: 'Nashik',
    issuers: 2,
    certificates: 150,
    status: 'Rejected',
    registeredOn: '05 Jun 2026',
  }),
];

function mkInstitution(base: {
  id: string;
  name: string;
  type: InstitutionType;
  city: string;
  issuers: number;
  certificates: number;
  status: InstitutionStatus;
  registeredOn: string;
}): Institution {
  const slug = base.name.toLowerCase().replace(/[^a-z]+/g, '').slice(0, 10);
  return {
    ...base,
    state: 'Maharashtra',
    country: 'India',
    email: `registrar@${slug}.ac.in`,
    contact: '+91 20 2712 3456',
    address: `${base.city} - Nagar Road`,
    adminName: 'Dr. Anjali Deshpande',
    adminEmail: `admin@${slug}.ac.in`,
    adminContact: '+91 98230 11223',
  };
}

/* ================================================================== */
/*  Style tokens (shared with the rest of the admin dashboard)         */
/* ================================================================== */

const TOKENS = `
  :root {
    --blue:#0050F5; --blue-dark:#0040C4; --blue-tint:#EFF4FF;
    --ink:#0F1729; --ink-soft:#5B647A; --ink-faint:#94A0B8;
    --line:#E6E9F0; --surface:#F7F8FB;
    --green:#16A34A; --green-tint:#F0FDF4; --green-line:#BBF7D0;
    --amber:#B45309; --amber-tint:#FFF7ED; --amber-line:#FED7AA;
    --red:#DC2626; --red-tint:#FEF2F2; --red-line:#FBD5D5;
    --gray:#475569; --gray-tint:#F1F5F9; --gray-line:#E2E8F0;
  }
  .inst-root { font-family:'Figtree',sans-serif; color:var(--ink); background:var(--surface); }
  .card { background:#fff; border:1px solid var(--line); border-radius:14px; }
  .btn-primary {
    font-family:inherit; font-size:14px; font-weight:600; border-radius:10px; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px; padding:10px 18px; background:var(--blue);
    color:#fff; border:none; transition:opacity .15s ease; white-space:nowrap;
  }
  .btn-primary:hover { opacity:.92; }
  .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .btn-ghost {
    font-family:inherit; font-size:14px; font-weight:600; border-radius:10px; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px; padding:10px 18px; background:#fff;
    border:1.5px solid var(--line); color:var(--ink); transition:background .15s ease; white-space:nowrap;
  }
  .btn-ghost:hover { background:var(--surface); }
  .btn-danger {
    font-family:inherit; font-size:14px; font-weight:600; border-radius:10px; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px; padding:10px 18px; background:var(--red);
    color:#fff; border:none; transition:opacity .15s ease;
  }
  .btn-danger:hover { opacity:.92; }
  .field-input {
    width:100%; padding:9.5px 12px; font-family:inherit; font-size:13.5px; color:var(--ink);
    border:1.5px solid var(--line); border-radius:10px; background:#fff;
    transition:border-color .15s ease, box-shadow .15s ease;
  }
  .field-input:focus { outline:none; border-color:var(--blue); box-shadow:0 0 0 4px var(--blue-tint); }
  .field-input:disabled { background:var(--surface); color:var(--ink-faint); cursor:not-allowed; }
  .badge {
    display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:700;
    padding:4px 10px; border-radius:999px; border:1px solid transparent; letter-spacing:.01em;
  }
  .badge-active { background:var(--green-tint); color:#166534; border-color:var(--green-line); }
  .badge-pending { background:var(--amber-tint); color:var(--amber); border-color:var(--amber-line); }
  .badge-suspended { background:var(--red-tint); color:#991B1B; border-color:var(--red-line); }
  .badge-rejected { background:var(--gray-tint); color:var(--gray); border-color:var(--gray-line); }
  table.inst-table { width:100%; border-collapse:collapse; font-size:13.5px; }
  table.inst-table thead th {
    text-align:left; font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;
    color:var(--ink-faint); padding:11px 14px; border-bottom:1px solid var(--line); white-space:nowrap;
  }
  table.inst-table tbody td { padding:13px 14px; border-bottom:1px solid var(--line); vertical-align:middle; }
  table.inst-table tbody tr:hover { background:var(--surface); }
  table.inst-table tbody tr:last-child td { border-bottom:none; }
`;

/* ================================================================== */
/*  Small shared UI primitives                                         */
/* ================================================================== */

function initials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

function Avatar({ name, size = 8 }: { name: string; size?: 8 | 11 }): ReactElement {
  const dims = size === 8 ? 'w-8 h-8 text-[11px] rounded-[8px]' : 'w-11 h-11 text-[14px] rounded-xl';
  return (
    <span
      className={`${dims} flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: 'linear-gradient(155deg,#0050F5,#0040C4)' }}
    >
      {initials(name)}
    </span>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  tone = 'blue',
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: { value: string; positive: boolean };
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
}): ReactElement {
  const toneMap: Record<string, { bg: string; fg: string }> = {
    blue: { bg: 'var(--blue-tint)', fg: 'var(--blue)' },
    green: { bg: 'var(--green-tint)', fg: 'var(--green)' },
    amber: { bg: 'var(--amber-tint)', fg: 'var(--amber)' },
    red: { bg: 'var(--red-tint)', fg: 'var(--red)' },
    gray: { bg: 'var(--gray-tint)', fg: 'var(--gray)' },
  };
  const t = toneMap[tone];
  return (
    <div className="card p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: t.bg }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: t.fg }} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${trend.positive ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
          >
            {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-[24px] font-extrabold leading-none m-0 tracking-tight">{value}</p>
        <p className="text-[12.5px] text-[#5B647A] m-0 mt-1.5">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: InstitutionStatus }): ReactElement {
  const cfg: Record<InstitutionStatus, { cls: string; icon: LucideIcon; label: string }> = {
    Active: { cls: 'badge-active', icon: CheckCircle2, label: 'Active' },
    Pending: { cls: 'badge-pending', icon: Clock, label: 'Pending' },
    Suspended: { cls: 'badge-suspended', icon: Ban, label: 'Suspended' },
    Rejected: { cls: 'badge-rejected', icon: XCircle, label: 'Rejected' },
  };
  const c = cfg[status];
  const Icon = c.icon;
  return (
    <span className={`badge ${c.cls}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function Toast({ toast }: { toast: ToastMsg }): ReactElement {
  const styles: Record<ToastType, string> = {
    success: 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
    info: 'bg-[#EFF4FF] text-[#0040C4] border-[#CBDCFF]',
    error: 'bg-[#FEF2F2] text-[#991B1B] border-[#FBD5D5]',
  };
  return (
    <div className={`w-full flex items-center gap-2.5 px-8 md:px-10 py-3 text-[13.5px] font-medium border-b ${styles[toast.type]}`}>
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      {toast.text}
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}): ReactElement {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-[440px] w-full p-6 shadow-[0_20px_50px_-12px_rgba(15,23,41,0.35)]">
        <div
          className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mb-3.5"
          style={{ background: danger ? 'var(--red-tint)' : 'var(--blue-tint)' }}
        >
          <AlertTriangle className="w-[21px] h-[21px]" style={{ color: danger ? 'var(--red)' : 'var(--blue)' }} />
        </div>
        <h3 className="text-[16.5px] font-bold m-0 mb-2">{title}</h3>
        <p className="text-[13.5px] text-[#5B647A] leading-relaxed m-0 mb-5">{body}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <button onClick={onConfirm} className={danger ? 'btn-danger flex-1 justify-center' : 'btn-primary flex-1 justify-center'}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-[var(--ink-faint)]" />
      </div>
      <p className="text-[14px] font-semibold m-0 mb-1">{title}</p>
      <p className="text-[13px] text-[#5B647A] m-0 max-w-sm">{body}</p>
    </div>
  );
}

function RowIconButton({
  icon: Icon,
  onClick,
  label,
  danger,
}: {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  danger?: boolean;
}): ReactElement {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-7 h-7 rounded-[6px] flex items-center justify-center border border-transparent transition-colors ${danger
        ? 'text-[var(--red)] hover:bg-[var(--red-tint)] hover:border-[var(--red-line)]'
        : 'text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:border-[var(--line)]'
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-[var(--line)]">
      <span className="text-[12.5px] text-[#5B647A]">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="w-8 h-8 rounded-[8px] border border-[var(--line)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--surface)]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-[8px] border border-[var(--line)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--surface)]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }): ReactElement {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--line)] last:border-b-0">
      <Icon className="w-4 h-4 text-[var(--ink-faint)] mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--ink-faint)] m-0">{label}</p>
        <p className="text-[13.5px] font-medium m-0 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Shared institution form fields (used by Add + Edit modals)         */
/* ================================================================== */

function FormSection({ title, children }: { title: string; children: ReactNode }): ReactElement {
  return (
    <div>
      <h4 className="text-[13px] font-bold uppercase tracking-wide text-[#5B647A] m-0 mb-3.5">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }): ReactElement {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5">
        {label} {required && <span className="text-[var(--red)]">*</span>}
      </label>
      {children}
    </div>
  );
}

function InstitutionFormFields({ defaults, idEditable = true }: { defaults?: Institution; idEditable?: boolean }): ReactElement {
  return (
    <>
      <FormSection title="Institution information">
        <FormField label="Institution name" required>
          <input name="name" required className="field-input" placeholder="e.g. Fergusson College" defaultValue={defaults?.name} />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Institution ID" required>
            <input
              name="id"
              required
              disabled={!idEditable}
              className="field-input"
              placeholder="INS-0009"
              defaultValue={defaults?.id}
            />
          </FormField>
          <FormField label="Institution type" required>
            <select name="type" required className="field-input" defaultValue={defaults?.type ?? ''}>
              <option value="" disabled>
                Select type
              </option>
              <option>University</option>
              <option>College</option>
              <option>Institute</option>
              <option>Training Institution</option>
            </select>
          </FormField>
          <FormField label="Official email" required>
            <input name="email" required type="email" className="field-input" placeholder="registrar@institution.ac.in" defaultValue={defaults?.email} />
          </FormField>
          <FormField label="Contact number" required>
            <input name="contact" required className="field-input" placeholder="+91 20 0000 0000" defaultValue={defaults?.contact} />
          </FormField>
          <FormField label="Country" required>
            <input name="country" required className="field-input" defaultValue={defaults?.country ?? 'India'} />
          </FormField>
          <FormField label="City" required>
            <input name="city" required className="field-input" placeholder="Pune" defaultValue={defaults?.city} />
          </FormField>
          <FormField label="State" required>
            <input name="state" required className="field-input" placeholder="Maharashtra" defaultValue={defaults?.state} />
          </FormField>
        </div>
        <FormField label="Address" required>
          <input name="address" required className="field-input" placeholder="Street, area, postal code" defaultValue={defaults?.address} />
        </FormField>
      </FormSection>

      <FormSection title="Administrative information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Administrator name" required>
            <input name="adminName" required className="field-input" placeholder="Dr. Full Name" defaultValue={defaults?.adminName} />
          </FormField>
          <FormField label="Administrator email" required>
            <input name="adminEmail" required type="email" className="field-input" placeholder="admin@institution.ac.in" defaultValue={defaults?.adminEmail} />
          </FormField>
        </div>
        <FormField label="Administrator contact" required>
          <input name="adminContact" required className="field-input" placeholder="+91 90000 00000" defaultValue={defaults?.adminContact} />
        </FormField>
      </FormSection>
    </>
  );
}

function readInstitutionForm(form: HTMLFormElement): Omit<Institution, 'issuers' | 'certificates' | 'status' | 'registeredOn'> {
  const data = new FormData(form);
  return {
    id: String(data.get('id') ?? ''),
    name: String(data.get('name') ?? ''),
    type: String(data.get('type') ?? 'College') as InstitutionType,
    email: String(data.get('email') ?? ''),
    contact: String(data.get('contact') ?? ''),
    country: String(data.get('country') ?? ''),
    city: String(data.get('city') ?? ''),
    state: String(data.get('state') ?? ''),
    address: String(data.get('address') ?? ''),
    adminName: String(data.get('adminName') ?? ''),
    adminEmail: String(data.get('adminEmail') ?? ''),
    adminContact: String(data.get('adminContact') ?? ''),
  };
}

/* ================================================================== */
/*  Add / Edit / View Institution Modals                               */
/* ================================================================== */

function AddInstitutionModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (inst: Institution) => void }): ReactElement {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const fields = readInstitutionForm(e.currentTarget);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit({
        ...fields,
        issuers: 0,
        certificates: 0,
        status: 'Pending',
        registeredOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-start md:items-center justify-center z-[100] p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-[0_20px_50px_-12px_rgba(15,23,41,0.35)]"
      >
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-[var(--line)]">
          <div>
            <h3 className="text-[18px] font-bold m-0">Add institution</h3>
            <p className="text-[13px] text-[#5B647A] m-0 mt-1">Register a new academic institution on the platform.</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface)] flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-7 max-h-[62vh] overflow-y-auto">
          <InstitutionFormFields />
        </div>

        <div className="flex gap-2.5 px-7 py-5 border-t border-[var(--line)]">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
            {submitting ? 'Registering…' : 'Register institution'}
          </button>
        </div>
      </form>
    </div>
  );
}

function EditInstitutionModal({
  institution,
  onClose,
  onSubmit,
}: {
  institution: Institution;
  onClose: () => void;
  onSubmit: (inst: Institution) => void;
}): ReactElement {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const fields = readInstitutionForm(e.currentTarget);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit({ ...institution, ...fields, id: institution.id });
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-start md:items-center justify-center z-[100] p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-[0_20px_50px_-12px_rgba(15,23,41,0.35)]"
      >
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-[var(--line)]">
          <div>
            <h3 className="text-[18px] font-bold m-0">Edit institution</h3>
            <p className="text-[13px] text-[#5B647A] m-0 mt-1">Update {institution.name}&rsquo;s details.</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface)] flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-7 max-h-[62vh] overflow-y-auto">
          <InstitutionFormFields defaults={institution} idEditable={false} />
        </div>

        <div className="flex gap-2.5 px-7 py-5 border-t border-[var(--line)]">
          <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ViewInstitutionModal({ institution, onClose }: { institution: Institution; onClose: () => void }): ReactElement {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-start md:items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full my-8 shadow-[0_20px_50px_-12px_rgba(15,23,41,0.35)]">
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-[var(--line)]">
          <div className="flex items-center gap-3.5">
            <Avatar name={institution.name} size={11} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px] font-bold m-0">{institution.name}</h3>
                <StatusBadge status={institution.status} />
              </div>
              <p className="text-[12.5px] text-[#5B647A] m-0 mt-0.5">
                {institution.id} · {institution.type}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface)] flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-7 py-2 max-h-[62vh] overflow-y-auto">
          <DetailRow icon={MapPin} label="Location" value={`${institution.address}, ${institution.city}, ${institution.state}, ${institution.country}`} />
          <DetailRow icon={Mail} label="Official email" value={institution.email} />
          <DetailRow icon={Phone} label="Contact number" value={institution.contact} />
          <DetailRow icon={UserCog} label="Administrator" value={`${institution.adminName} · ${institution.adminEmail}`} />
          <DetailRow icon={Phone} label="Administrator contact" value={institution.adminContact} />
          <DetailRow icon={Clock} label="Registered on" value={institution.registeredOn} />
        </div>

        <div className="flex justify-end px-7 py-5 border-t border-[var(--line)]">
          <button onClick={onClose} className="btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Institutions List Page                                             */
/* ================================================================== */

const PAGE_SIZE = 5;

function InstitutionsListPage({
  institutions,
  onView,
  onEdit,
  onDelete,
  onAddClick,
}: {
  institutions: Institution[];
  onView: (inst: Institution) => void;
  onEdit: (inst: Institution) => void;
  onDelete: (inst: Institution) => void;
  onAddClick: () => void;
}): ReactElement {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InstitutionStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | InstitutionType>('All');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return institutions.filter((inst) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || inst.name.toLowerCase().includes(q) || inst.id.toLowerCase().includes(q) || inst.email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || inst.status === statusFilter;
      const matchesType = typeFilter === 'All' || inst.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [institutions, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const pageItems = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  const hasActiveFilters = search !== '' || statusFilter !== 'All' || typeFilter !== 'All';

  const clearFilters = (): void => {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setPage(1);
  };

  const stats = useMemo(() => {
    const total = institutions.length;
    const active = institutions.filter((i) => i.status === 'Active').length;
    const pending = institutions.filter((i) => i.status === 'Pending').length;
    const totalCerts = institutions.reduce((sum, i) => sum + i.certificates, 0);
    return { total, active, pending, totalCerts };
  }, [institutions]);

  return (
    <div className="w-full space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Institutions
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Institution management
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage registered academic institutions and their status on the platform.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            Add institution
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} value={stats.total.toString()} label="Total institutions" />
        <StatCard icon={ShieldCheck} value={stats.active.toString()} label="Active institutions" tone="green" />
        <StatCard icon={Clock} value={stats.pending.toString()} label="Pending approval" tone="amber" />
        <StatCard icon={FileText} value={stats.totalCerts.toLocaleString()} label="Total certificates" />
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[var(--ink-faint)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, institution ID, or official email…"
            className="field-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap lg:flex-nowrap flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[var(--ink-faint)] text-xs font-semibold flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'All' | InstitutionStatus);
              setPage(1);
            }}
            className="field-input flex-shrink-0"
            style={{ width: 150 }}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as 'All' | InstitutionType);
              setPage(1);
            }}
            className="field-input flex-shrink-0"
            style={{ width: 180 }}
          >
            <option value="All">All types</option>
            <option value="University">University</option>
            <option value="College">College</option>
            <option value="Institute">Institute</option>
            <option value="Training Institution">Training Institution</option>
          </select>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost flex-shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="inst-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Institution ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((inst) => (
                <tr key={inst.id}>
                  <td>
                    <button onClick={() => onView(inst)} className="flex items-center gap-2.5 text-left hover:text-[var(--blue)]">
                      <Avatar name={inst.name} />
                      <span className="font-semibold">{inst.name}</span>
                    </button>
                  </td>
                  <td className="text-[var(--ink-soft)]">{inst.id}</td>
                  <td>{inst.type}</td>
                  <td className="text-[var(--ink-soft)]">
                    {inst.city}, {inst.state}
                  </td>
                  <td>
                    <StatusBadge status={inst.status} />
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <RowIconButton icon={Eye} label="View" onClick={() => onView(inst)} />
                      <RowIconButton icon={Pencil} label="Edit" onClick={() => onEdit(inst)} />
                      <RowIconButton icon={Trash2} label="Delete" danger onClick={() => onDelete(inst)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState icon={Inbox} title="No institutions found" body="Try adjusting your search or filters, or clear them to see all institutions." />
        )}

        {filtered.length > 0 && <Pagination page={page_} totalPages={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Root module                                                        */
/* ================================================================== */

export default function InstitutionsModule(): ReactElement {
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewing, setViewing] = useState<Institution | null>(null);
  const [editing, setEditing] = useState<Institution | null>(null);
  const [deleting, setDeleting] = useState<Institution | null>(null);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (text: string, type: ToastType = 'success'): void => {
    setToast({ text, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  };

  const handleAddSubmit = (inst: Institution): void => {
    setInstitutions((prev) => [inst, ...prev]);
    setAddModalOpen(false);
    showToast('Institution registered successfully.', 'success');
  };

  const handleEditSubmit = (inst: Institution): void => {
    setInstitutions((prev) => prev.map((i) => (i.id === inst.id ? inst : i)));
    setEditing(null);
    showToast(`${inst.name} was updated.`, 'success');
  };

  const confirmDelete = (): void => {
    if (!deleting) return;
    setInstitutions((prev) => prev.filter((i) => i.id !== deleting.id));
    showToast(`${deleting.name} was deleted.`, 'info');
    setDeleting(null);
  };

  return (
    <div className="inst-root w-full min-h-full">
      <style>{TOKENS}</style>
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {toast && (
        <div className="sticky top-0 z-20">
          <Toast toast={toast} />
        </div>
      )}

      <InstitutionsListPage
        institutions={institutions}
        onView={setViewing}
        onEdit={setEditing}
        onDelete={setDeleting}
        onAddClick={() => setAddModalOpen(true)}
      />

      {addModalOpen && <AddInstitutionModal onClose={() => setAddModalOpen(false)} onSubmit={handleAddSubmit} />}
      {viewing && <ViewInstitutionModal institution={viewing} onClose={() => setViewing(null)} />}
      {editing && <EditInstitutionModal institution={editing} onClose={() => setEditing(null)} onSubmit={handleEditSubmit} />}

      {deleting && (
        <ConfirmDialog
          title="Delete institution?"
          body={`${deleting.name} and its records will be permanently removed. This can\u2019t be undone.`}
          confirmLabel="Delete institution"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}