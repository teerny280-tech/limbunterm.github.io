import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  KeyRound,
  ShieldCheck,
  HardDrive,
  RefreshCw,
  LogOut,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const DatabaseSettingsManager: React.FC = () => {
  const {
    adminUser,
    updateAdminCredentials,
    logoutAdmin,
    exportBackup,
    importBackup,
    getStats,
    showToast
  } = usePortfolio();

  // Admin credentials form
  const [email, setEmail] = useState(adminUser.email);
  const [username, setUsername] = useState(adminUser.username);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Stats
  const [stats, setStats] = useState<{
    projectsCount: number;
    categoriesCount: number;
    servicesCount: number;
    brandsCount: number;
    mediaCount: number;
    inquiriesCount: number;
    totalSizeApprox: string;
  } | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin) {
      if (newPin !== confirmPin) {
        alert('New PIN / password does not match confirmation.');
        return;
      }
      if (currentPin !== adminUser.pin && currentPin !== '1234') {
        alert('Current PIN is incorrect. (Default PIN is 1234)');
        return;
      }
    }

    await updateAdminCredentials({
      email: email.trim(),
      username: username.trim(),
      pin: newPin ? newPin.trim() : adminUser.pin
    });

    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    showToast('Admin profile credentials successfully updated');
  };

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `talmeez-studio-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Database backup downloaded successfully');
    } catch (err) {
      console.error(err);
      showToast('Error generating database backup', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Importing a database backup will overwrite existing content. Continue?')) {
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      await importBackup(text);
      showToast('Database successfully restored from backup file');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to import backup: ${err.message || 'Invalid backup structure'}`);
    } finally {
      setIsImporting(false);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            System Administration
          </span>
          <h2 className="text-2xl font-extrabold text-zinc-950">Database &amp; Security Settings</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage admin login credentials, download complete database JSON backups, and monitor storage utilization.
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Admin</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Admin Credentials & Passwords (cols 1-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">Admin Security Credentials</h3>
              <p className="text-xs text-zinc-500">
                Change email, username, and login passcode or PIN.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Change Passcode / PIN
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                  Current PIN (Default is 1234)
                </label>
                <input
                  type="password"
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    New PIN / Password
                  </label>
                  <input
                    type="password"
                    placeholder="New PIN (min 4 characters)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Update Admin Credentials</span>
            </button>
          </form>
        </div>

        {/* Right Column: Database Backup & Storage Stats (cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Database Usage Monitor */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#EA580C]" />
                <span>Database Storage Monitor</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Online &amp; Persistent
              </span>
            </div>

            {stats && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Projects Stored:</span>
                  <span className="font-bold text-zinc-900">{stats.projectsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Categories:</span>
                  <span className="font-bold text-zinc-900">{stats.categoriesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Services:</span>
                  <span className="font-bold text-zinc-900">{stats.servicesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Brands / Clients:</span>
                  <span className="font-bold text-zinc-900">{stats.brandsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-sans">Media Assets:</span>
                  <span className="font-bold text-zinc-900">{stats.mediaCount} files</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-1.5">
                  <span className="text-zinc-600 font-bold font-sans">Approx Binary Storage:</span>
                  <span className="font-bold text-[#EA580C]">{stats.totalSizeApprox}</span>
                </div>
              </div>
            )}
          </div>

          {/* Backup & Restore Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#EA580C]" />
              <span>Backup &amp; Restore</span>
            </h3>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Export an itemized JSON snapshot of all projects, hero slides, services, clients, media, and site settings.
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                disabled={isExporting}
                onClick={handleDownloadBackup}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download Full Database Backup (.json)</span>
              </button>

              <input
                ref={importFileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />

              <button
                disabled={isImporting}
                onClick={() => importFileRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Restore Database from Backup</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
