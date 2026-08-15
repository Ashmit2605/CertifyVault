import React, { useState } from 'react';
import type { ReactElement } from 'react';
import {
  Settings,
  Lock,
  Bell,
  User,
  Eye,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Network,
  LogOut,
  Edit2,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabId =
  | 'general'
  | 'verification'
  | 'fraud'
  | 'blockchain'
  | 'security'
  | 'notifications'
  | 'profile';

interface TabConfig {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface GeneralSettings {
  institutionName: string;
  platformDescription: string;
  supportEmail: string;
  certificateValidity: string;
  certificateIdPrefix: string;
  dateTimeFormat: string;
  defaultLanguage: string;
}

interface VerificationSettings {
  qrVerification: boolean;
  blockchainVerification: boolean;
  ocrComparison: boolean;
  aiAnalysis: boolean;
  ocrThreshold: number;
  automaticMode: boolean;
  manualReviewRequired: boolean;
}

interface FraudSettings {
  lowRiskThreshold: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  autoFraudAlert: boolean;
  autoManualReview: boolean;
  imageTampering: boolean;
  signatureVerification: boolean;
  logoVerification: boolean;
}

interface BlockchainSettings {
  network: string;
  networkStatus: string;
  smartContractAddress: string;
  issuerWalletAddress: string;
  confirmationRequired: number;
  transactionMonitoring: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  loginAttemptLimit: number;
  autoLogout: boolean;
  apiSecurityStatus: string;
}

interface NotificationSettings {
  fraudAlerts: boolean;
  failedVerification: boolean;
  certificateIssuance: boolean;
  certificateRevocation: boolean;
  blockchainFailure: boolean;
  systemHealth: boolean;
}

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  accountStatus: string;
  twoFactorEnabled: boolean;
}

interface ActiveSession {
  id: number;
  device: string;
  lastActive: string;
  location: string;
}

type SettingsSection =
  | 'general'
  | 'verification'
  | 'fraud'
  | 'blockchain'
  | 'security'
  | 'notifications';

type MessageType = 'success' | 'info' | 'error';

interface SaveMessage {
  type: MessageType;
  text: string;
}

type ConfirmationType = 'confirm-save' | 'confirm-reset';

interface ConfirmationState {
  type: ConfirmationType;
  section: SettingsSection;
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminSettingsPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<ConfirmationState | null>(null);

  // General Settings State
  const [general, setGeneral] = useState<GeneralSettings>({
    institutionName: 'Credential Vault Platform',
    platformDescription: 'Secure certificate verification and blockchain integration system',
    supportEmail: 'support@vault.io',
    certificateValidity: '365',
    certificateIdPrefix: 'CERT-',
    dateTimeFormat: 'DD/MM/YYYY HH:mm',
    defaultLanguage: 'English',
  });

  // Verification Settings State
  const [verification, setVerification] = useState<VerificationSettings>({
    qrVerification: true,
    blockchainVerification: true,
    ocrComparison: true,
    aiAnalysis: true,
    ocrThreshold: 75,
    automaticMode: true,
    manualReviewRequired: false,
  });

  // Fraud Detection State
  const [fraud, setFraud] = useState<FraudSettings>({
    lowRiskThreshold: 30,
    mediumRiskThreshold: 60,
    highRiskThreshold: 80,
    autoFraudAlert: true,
    autoManualReview: true,
    imageTampering: true,
    signatureVerification: true,
    logoVerification: true,
  });

  // Blockchain Settings State
  const [blockchain, setBlockchain] = useState<BlockchainSettings>({
    network: 'Ethereum Mainnet',
    networkStatus: 'Connected',
    smartContractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f....',
    issuerWalletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    confirmationRequired: 6,
    transactionMonitoring: true,
  });

  // Security Settings State
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'Strong (12+ chars, mixed case, numbers, symbols)',
    loginAttemptLimit: 5,
    autoLogout: true,
    apiSecurityStatus: 'Active',
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    fraudAlerts: true,
    failedVerification: true,
    certificateIssuance: true,
    certificateRevocation: true,
    blockchainFailure: true,
    systemHealth: true,
  });

  // Administrator Profile State
  const [adminProfile] = useState<AdminProfile>({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@vault.io',
    role: 'Platform Administrator',
    lastLogin: '2025-08-15 14:32 UTC',
    accountStatus: 'Active',
    twoFactorEnabled: true,
  });

  // Active sessions
  const [activeSessions] = useState<ActiveSession[]>([
    { id: 1, device: 'Chrome - MacBook Pro', lastActive: '2 minutes ago', location: 'New York, US' },
    { id: 2, device: 'Safari - iPad', lastActive: '1 hour ago', location: 'New York, US' },
    { id: 3, device: 'Firefox - Ubuntu', lastActive: '3 hours ago', location: 'San Francisco, US' },
  ]);

  // Handle save with confirmation for sensitive changes
  const handleSave = (section: SettingsSection): void => {
    if (['security', 'blockchain'].includes(section)) {
      setShowConfirmation({ type: 'confirm-save', section });
    } else {
      confirmSave(section);
    }
  };

  const confirmSave = (_section: SettingsSection): void => {
    setSaveMessage({ type: 'success', text: 'Settings updated successfully.' });
    setShowConfirmation(null);
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleReset = (section: SettingsSection): void => {
    setShowConfirmation({ type: 'confirm-reset', section });
  };

  const confirmReset = (_section: SettingsSection): void => {
    // Reset to initial state
    setSaveMessage({ type: 'info', text: 'Settings reset to defaults.' });
    setShowConfirmation(null);
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Tabs configuration
  const tabs: TabConfig[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'verification', label: 'Verification', icon: Eye },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertCircle },
    { id: 'blockchain', label: 'Blockchain', icon: Network },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Administrator', icon: User },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Figtree', sans-serif" }}>
      {/* Google Fonts Link */}
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#0050F5' }}>
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-600 text-gray-900">Settings</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage platform configuration, verification rules, security, notifications, and administrator preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Info Messages */}
      {saveMessage && (
        <div
          className={`px-6 py-3 border-b flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <CheckCircle className={`w-5 h-5 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-blue-600'}`} />
          <span className={saveMessage.type === 'success' ? 'text-green-800' : 'text-blue-800'}>
            {saveMessage.text}
          </span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-600 text-gray-900">
                  {showConfirmation.type === 'confirm-save' ? 'Confirm Changes' : 'Reset Settings'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {showConfirmation.type === 'confirm-save'
                  ? `You are about to save changes to ${showConfirmation.section} settings. These changes will take effect immediately.`
                  : `Are you sure you want to reset all ${showConfirmation.section} settings to their default values? This action cannot be undone.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showConfirmation.type === 'confirm-save') {
                      confirmSave(showConfirmation.section);
                    } else {
                      confirmReset(showConfirmation.section);
                    }
                  }}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex-1 px-4 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  {showConfirmation.type === 'confirm-save' ? 'Save Changes' : 'Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-500 transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#0050F5' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">General Settings</h2>

              <div className="space-y-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-2">Institution/Platform Name</label>
                  <input
                    type="text"
                    value={general.institutionName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGeneral({ ...general, institutionName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>

                {/* Platform Description */}
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-2">Platform Description</label>
                  <textarea
                    value={general.platformDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setGeneral({ ...general, platformDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={general.supportEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGeneral({ ...general, supportEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                </div>

                {/* Certificate Settings - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Default Certificate Validity (days)</label>
                    <input
                      type="number"
                      value={general.certificateValidity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setGeneral({ ...general, certificateValidity: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Certificate ID Prefix</label>
                    <input
                      type="text"
                      value={general.certificateIdPrefix}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setGeneral({ ...general, certificateIdPrefix: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: CERT-20250815001</p>
                  </div>

                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Date/Time Format</label>
                    <select
                      value={general.dateTimeFormat}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setGeneral({ ...general, dateTimeFormat: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    >
                      <option>DD/MM/YYYY HH:mm</option>
                      <option>MM/DD/YYYY HH:mm</option>
                      <option>YYYY-MM-DD HH:mm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Default Language</label>
                    <select
                      value={general.defaultLanguage}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setGeneral({ ...general, defaultLanguage: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('general')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('general')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Settings */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">Verification Settings</h2>

              <div className="space-y-5">
                <ToggleSetting
                  label="Enable QR Verification"
                  description="Allow certificate verification through QR codes"
                  checked={verification.qrVerification}
                  onChange={(val) => setVerification({ ...verification, qrVerification: val })}
                />

                <ToggleSetting
                  label="Enable Blockchain Verification"
                  description="Verify certificates against blockchain records"
                  checked={verification.blockchainVerification}
                  onChange={(val) => setVerification({ ...verification, blockchainVerification: val })}
                />

                <ToggleSetting
                  label="Enable OCR Comparison"
                  description="Use optical character recognition to verify certificate content"
                  checked={verification.ocrComparison}
                  onChange={(val) => setVerification({ ...verification, ocrComparison: val })}
                />

                <ToggleSetting
                  label="Enable AI Fraud Analysis"
                  description="Automatically scan for signs of tampering and forgery"
                  checked={verification.aiAnalysis}
                  onChange={(val) => setVerification({ ...verification, aiAnalysis: val })}
                />

                <ToggleSetting
                  label="Automatic Verification Mode"
                  description="Process verifications automatically without manual intervention"
                  checked={verification.automaticMode}
                  onChange={(val) => setVerification({ ...verification, automaticMode: val })}
                />

                <ToggleSetting
                  label="Manual Review Requirement"
                  description="Require administrator review for all verification results"
                  checked={verification.manualReviewRequired}
                  onChange={(val) => setVerification({ ...verification, manualReviewRequired: val })}
                />

                {/* Slider Setting */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-500 text-gray-700 mb-2">
                    OCR Confidence Threshold
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={verification.ocrThreshold}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setVerification({ ...verification, ocrThreshold: parseInt(e.target.value, 10) })
                      }
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #0050F5 0%, #0050F5 ${verification.ocrThreshold}%, #E5E5E5 ${verification.ocrThreshold}%, #E5E5E5 100%)`,
                      }}
                    />
                    <span className="text-2xl font-600" style={{ color: '#0050F5', minWidth: '50px' }}>
                      {verification.ocrThreshold}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Certificates with OCR confidence below this threshold will require manual review
                  </p>
                </div>
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('verification')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('verification')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Detection Settings */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-2">Fraud Detection Settings</h2>
              <p className="text-sm text-gray-600 mb-6">
                These values determine how the system classifies suspicious certificates. Certificates
                scoring above each threshold will be flagged with the corresponding risk level.
              </p>

              <div className="space-y-5">
                {/* Risk Thresholds */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <label className="block text-sm font-500 text-gray-700 mb-2">Low-Risk Threshold</label>
                    <input
                      type="number"
                      value={fraud.lowRiskThreshold}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFraud({ ...fraud, lowRiskThreshold: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">0–{fraud.lowRiskThreshold}%: Low risk</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <label className="block text-sm font-500 text-gray-700 mb-2">Medium-Risk Threshold</label>
                    <input
                      type="number"
                      value={fraud.mediumRiskThreshold}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFraud({ ...fraud, mediumRiskThreshold: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {fraud.lowRiskThreshold}–{fraud.mediumRiskThreshold}%: Medium risk
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <label className="block text-sm font-500 text-gray-700 mb-2">High-Risk Threshold</label>
                    <input
                      type="number"
                      value={fraud.highRiskThreshold}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFraud({ ...fraud, highRiskThreshold: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">{fraud.highRiskThreshold}% and above: High risk</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <ToggleSetting
                    label="Automatic Fraud Alert"
                    description="Send alerts when high-risk certificates are detected"
                    checked={fraud.autoFraudAlert}
                    onChange={(val) => setFraud({ ...fraud, autoFraudAlert: val })}
                  />
                </div>

                <ToggleSetting
                  label="Automatic Manual Review Trigger"
                  description="Automatically send suspicious certificates for manual review"
                  checked={fraud.autoManualReview}
                  onChange={(val) => setFraud({ ...fraud, autoManualReview: val })}
                />

                {/* Detection Methods */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-600 text-gray-900 mb-4">Detection Methods</h3>
                  <ToggleSetting
                    label="Image Tampering Detection"
                    description="Detect signs of image manipulation and editing"
                    checked={fraud.imageTampering}
                    onChange={(val) => setFraud({ ...fraud, imageTampering: val })}
                  />
                </div>

                <ToggleSetting
                  label="Signature Verification"
                  description="Validate issuer signatures against known keys"
                  checked={fraud.signatureVerification}
                  onChange={(val) => setFraud({ ...fraud, signatureVerification: val })}
                />

                <ToggleSetting
                  label="Logo/Seal Verification"
                  description="Verify authenticity of institution logos and seals"
                  checked={fraud.logoVerification}
                  onChange={(val) => setFraud({ ...fraud, logoVerification: val })}
                />
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('fraud')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('fraud')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Settings */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">Blockchain Settings</h2>

              <div className="space-y-5">
                {/* Network Configuration */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Network className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-600 text-blue-900 mb-2">Network Status</h3>
                      <p className="text-xs text-blue-700">Connected to Ethereum Mainnet. Last update: 2 minutes ago.</p>
                    </div>
                  </div>
                </div>

                {/* Read-only Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Blockchain Network</label>
                    <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-500">
                      {blockchain.network}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">System-managed configuration</p>
                  </div>

                  <div>
                    <label className="block text-sm font-500 text-gray-700 mb-2">Network Status</label>
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-500 text-gray-700">{blockchain.networkStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Smart Contract & Wallet - Read-only with Lock */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-500 text-gray-700">Smart Contract Address</label>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono">
                        {blockchain.smartContractAddress}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Read-only - System-managed for security</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-500 text-gray-700">Issuer Wallet Address</label>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono">
                        {blockchain.issuerWalletAddress}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Read-only - Private keys not exposed</p>
                    </div>
                  </div>
                </div>

                {/* Configurable Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-500 text-gray-700 mb-2">
                        Blockchain Confirmation Requirement
                      </label>
                      <input
                        type="number"
                        value={blockchain.confirmationRequired}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBlockchain({ ...blockchain, confirmationRequired: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Number of block confirmations required for finality</p>
                    </div>

                    <div className="flex items-end">
                      <ToggleSetting
                        label="Transaction Monitoring"
                        description="Monitor blockchain transactions for certificate issuance"
                        checked={blockchain.transactionMonitoring}
                        onChange={(val) => setBlockchain({ ...blockchain, transactionMonitoring: val })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('blockchain')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('blockchain')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">Security Settings</h2>

              <div className="space-y-5">
                <ToggleSetting
                  label="Two-Factor Authentication"
                  description="Require two-factor authentication for all administrator access"
                  checked={security.twoFactorAuth}
                  onChange={(val) => setSecurity({ ...security, twoFactorAuth: val })}
                />

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-500 text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSecurity({ ...security, sessionTimeout: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatically log out users after this period of inactivity</p>
                </div>

                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-2">Password Policy</label>
                  <select
                    value={security.passwordPolicy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSecurity({ ...security, passwordPolicy: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  >
                    <option>Basic (8+ chars)</option>
                    <option>Medium (10+ chars, mixed case)</option>
                    <option>Strong (12+ chars, mixed case, numbers, symbols)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-500 text-gray-700 mb-2">Login Attempt Limit</label>
                  <input
                    type="number"
                    value={security.loginAttemptLimit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSecurity({ ...security, loginAttemptLimit: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Failed attempts before account lockout</p>
                </div>

                <ToggleSetting
                  label="Automatic Logout"
                  description="Log out users automatically when session timeout is reached"
                  checked={security.autoLogout}
                  onChange={(val) => setSecurity({ ...security, autoLogout: val })}
                />

                <div className="pt-4 border-t border-gray-200 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-500 text-green-900">API Security Status</p>
                      <p className="text-xs text-green-700 mt-1">
                        All API endpoints are secured with rate limiting and authentication
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-600 text-gray-900 mb-4">Active Administrator Sessions</h3>
                <div className="space-y-2">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm font-500 text-gray-900">{session.device}</p>
                          <p className="text-xs text-gray-500">
                            {session.location} • Last active {session.lastActive}
                          </p>
                        </div>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-700 font-500">
                        End Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('security')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('security')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">Notification Settings</h2>

              <div className="space-y-3">
                <ToggleSetting
                  label="Fraud Detection Alerts"
                  description="Receive notifications when suspicious certificates are detected"
                  checked={notifications.fraudAlerts}
                  onChange={(val) => setNotifications({ ...notifications, fraudAlerts: val })}
                />

                <ToggleSetting
                  label="Failed Verification Alerts"
                  description="Get notified when certificate verification fails"
                  checked={notifications.failedVerification}
                  onChange={(val) => setNotifications({ ...notifications, failedVerification: val })}
                />

                <ToggleSetting
                  label="Certificate Issuance Notifications"
                  description="Receive alerts when new certificates are issued"
                  checked={notifications.certificateIssuance}
                  onChange={(val) => setNotifications({ ...notifications, certificateIssuance: val })}
                />

                <ToggleSetting
                  label="Certificate Revocation Notifications"
                  description="Get notified when certificates are revoked"
                  checked={notifications.certificateRevocation}
                  onChange={(val) => setNotifications({ ...notifications, certificateRevocation: val })}
                />

                <ToggleSetting
                  label="Blockchain Transaction Failure Alerts"
                  description="Receive alerts if blockchain transactions fail"
                  checked={notifications.blockchainFailure}
                  onChange={(val) => setNotifications({ ...notifications, blockchainFailure: val })}
                />

                <ToggleSetting
                  label="System Health Alerts"
                  description="Get notified about system uptime, performance, and maintenance"
                  checked={notifications.systemHealth}
                  onChange={(val) => setNotifications({ ...notifications, systemHealth: val })}
                />
              </div>

              {/* Save/Reset Controls */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleSave('notifications')}
                  style={{ backgroundColor: '#0050F5' }}
                  className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-500 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleReset('notifications')}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-500 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Administrator Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-600 text-gray-900 mb-6">Administrator Profile</h2>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar & Quick Info */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-600 mb-4"
                    style={{ backgroundColor: '#0050F5' }}
                  >
                    {adminProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <button
                    style={{ backgroundColor: '#0050F5' }}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-500 text-sm hover:opacity-90 transition-opacity"
                  >
                    <Edit2 className="w-4 h-4" />
                    Change Avatar
                  </button>
                </div>

                {/* Profile Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs font-500 text-gray-500 uppercase">Full Name</label>
                    <p className="text-lg font-500 text-gray-900">{adminProfile.name}</p>
                  </div>

                  <div>
                    <label className="text-xs font-500 text-gray-500 uppercase">Email</label>
                    <p className="text-lg font-500 text-gray-900">{adminProfile.email}</p>
                  </div>

                  <div>
                    <label className="text-xs font-500 text-gray-500 uppercase">Role</label>
                    <p className="text-lg font-500 text-gray-900">{adminProfile.role}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-500 text-gray-500 uppercase">Last Login</label>
                      <p className="text-sm text-gray-700 font-500">{adminProfile.lastLogin}</p>
                    </div>
                    <div>
                      <label className="text-xs font-500 text-gray-500 uppercase">Account Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700 font-500">{adminProfile.accountStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings for Profile */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-600 text-gray-900 mb-6">Account Security</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-500 text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">
                        {adminProfile.twoFactorEnabled ? 'Enabled • Last updated 3 days ago' : 'Not enabled'}
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-gray-700 hover:text-gray-900 font-500">Manage</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-500 text-gray-900">Change Password</p>
                      <p className="text-xs text-gray-500">Last changed 45 days ago</p>
                    </div>
                  </div>
                  <button className="text-sm text-gray-700 hover:text-gray-900 font-500">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-500 text-red-900">Logout from All Devices</p>
                      <p className="text-xs text-red-700">End all active sessions across devices</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-700 font-500">Logout All</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable Toggle Component                                          */
/* ------------------------------------------------------------------ */

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps): ReactElement {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-500 text-gray-900 block">{label}</label>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className="shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        style={{
          backgroundColor: checked ? '#0050F5' : '#D1D5DB',
        }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}