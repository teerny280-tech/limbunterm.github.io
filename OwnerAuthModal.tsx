import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, KeyRound, Shield, Check, AlertCircle, LogOut } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const OwnerAuthModal: React.FC = () => {
  const {
    isPinModalOpen,
    setIsPinModalOpen,
    loginAdmin,
    logoutAdmin,
    isOwnerMode,
    adminUser,
    setCurrentView,
    updateAdminCredentials
  } = usePortfolio();

  const [inputIdentifier, setInputIdentifier] = useState('admin@studio.design');
  const [inputPin, setInputPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');

  if (!isPinModalOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(inputIdentifier, inputPin);
    if (success) {
      setIsPinModalOpen(false);
      setCurrentView('dashboard');
    } else {
      setErrorMsg('Incorrect PIN or email. The default studio PIN is 1234.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      updateAdminCredentials({ pin: newPin.trim() });
      setShowChangePin(false);
      setNewPin('');
      alert('Studio PIN successfully updated!');
    } else {
      alert('Please enter at least 4 digits/characters for your PIN.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <div className="fixed inset-0" onClick={() => setIsPinModalOpen(false)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 bg-white text-zinc-900 rounded-[28px] max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                  Studio Security
                </span>
                <h3 className="text-lg font-bold text-zinc-950">
                  {isOwnerMode ? 'Studio Admin Active' : 'Admin Authentication'}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-4">
            {isOwnerMode ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Admin Studio Access Unlocked
                  </p>
                  <p className="text-zinc-600">
                    You have full permission to edit all website content, media library, hero slideshows, and projects.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsPinModalOpen(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md transition-all text-center"
                  >
                    Open Studio CMS Dashboard &rarr;
                  </button>

                  <button
                    onClick={() => {
                      logoutAdmin();
                      setIsPinModalOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Lock Studio Mode (Log Out)
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-4">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Enter your Administrator credentials or PIN to access the Content Management System.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={inputIdentifier}
                      onChange={(e) => setInputIdentifier(e.target.value)}
                      placeholder="admin@studio.design"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Passcode / PIN
                    </label>
                    <input
                      type="password"
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      placeholder="Enter 4-digit PIN (1234)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono outline-none focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-[11px] text-zinc-500">
                  <span className="font-bold text-zinc-800">Quick Test Credentials:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span>Default PIN: <strong className="font-mono text-zinc-900">1234</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputIdentifier('admin@studio.design');
                        setInputPin('1234');
                      }}
                      className="text-[#EA580C] font-semibold hover:underline"
                    >
                      Fill Default
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Verify &amp; Enter CMS Dashboard
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
