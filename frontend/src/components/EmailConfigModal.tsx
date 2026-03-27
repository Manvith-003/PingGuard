"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { useToast } from "./ui/Toast";
import { getEmailConfig, setEmailConfig } from "@/services/api";
import { Mail, Clock, Plus, X, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailConfigModal: React.FC<EmailConfigModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [intervalKey, setIntervalKey] = useState("1h");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    setFetching(true);
    try {
      const data = await getEmailConfig();
      if (data.emails) setEmails(data.emails);
      if (data.intervalKey) setIntervalKey(data.intervalKey);
    } catch (err) {
      console.error("Failed to fetch config:", err);
    } finally {
      setFetching(false);
    }
  };

  const addEmail = () => {
    if (!newEmail) return;
    // Simple email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast("Invalid email address", "error");
      return;
    }
    if (emails.includes(newEmail)) {
      toast("Email already added", "info");
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const saveConfig = async () => {
    if (emails.length === 0) {
      toast("Add at least one email address", "error");
      return;
    }
    setLoading(true);
    try {
      await setEmailConfig({ emails, intervalKey });
      toast("Notification settings saved", "success");
      onClose();
    } catch (err) {
      toast("Failed to save configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Settings">
      <div className="space-y-6">
        {/* Email Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            Recipient Emails
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
            <button
              onClick={(e) => { e.preventDefault(); addEmail(); }}
              type="button"
              className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-1 bg-white/[0.02] rounded-xl border border-white/5 empty:hidden">
            <AnimatePresence>
              {emails.map((email) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  {email}
                  <button onClick={() => removeEmail(email)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {emails.length === 0 && !fetching && (
              <p className="text-xs text-slate-600 italic py-2 px-3">No emails added yet</p>
            )}
          </div>
        </div>

        {/* Interval Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Daily Report Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "1m", label: "1 Minute" },
              { key: "1h", label: "Hourly" },
              { key: "6h", label: "6 Hours" },
              { key: "12h", label: "12 Hours" },
              { key: "1d", label: "Daily" },
              { key: "7d", label: "Weekly" },
              { key: "1M", label: "Monthly" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setIntervalKey(item.key)}
                className={`px-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border ${intervalKey === item.key
                  ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_-5px_#2563eb]"
                  : "bg-white/5 border-white/10 text-slate-500 hover:bg-white/10"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveConfig}
            disabled={loading || fetching}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};
