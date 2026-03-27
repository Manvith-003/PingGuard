"use client";

import { useEffect, useState } from "react";
import { Website } from "@/types/website";
import { getWebsites, deleteWebsite, pingWebsites, setMonitoringInterval } from "@/services/api";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { 
  Plus, 
  RefreshCcw, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Globe, 
  Zap,
  Activity,
  MoreVertical,
  Settings,
  AlertTriangle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { EmailConfigModal } from "@/components/EmailConfigModal";

export default function Home() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getWebsites();
      setWebsites(data);
    } catch (err) {
      toast("Error fetching data", "error");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const setIntervalHandler = async (value: number) => {
    if (!value) return;
    try {
      await setMonitoringInterval(value);
      toast(`Monitoring interval updated to ${value}m`, "success");
    } catch (err) {
      toast("Failed to update interval", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteWebsite(deleteId);
      setWebsites(prev => prev.filter(s => s._id !== deleteId));
      toast(`Deleted ${deleteName}`, "success");
    } catch (err) {
      toast("Delete failed", "error");
    } finally {
      setDeleteId(null);
      setDeleteName("");
    }
  };

  const handleDeleteRequest = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handlePing = async () => {
    try {
      toast("Initiating global status check...", "info");
      await pingWebsites();
      await fetchData();
      toast("System wide health check complete", "success");
    } catch (err) {
      toast("Global check failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      {/* 🔹 Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-auto py-3 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="p-2 bg-blue-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PingGuard
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/10 flex-1 md:flex-none max-w-[150px] md:max-w-none">
              <Clock className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
              <select
                onChange={(e) => setIntervalHandler(Number(e.target.value))}
                className="bg-transparent text-sm font-medium border-none focus:outline-none appearance-none cursor-pointer pr-4 w-full"
                defaultValue=""
              >
                <option value="" className="bg-[#111827]">Interval</option>
                <option value={1} className="bg-[#111827]">1m</option>
                <option value={5} className="bg-[#111827]">5m</option>
                <option value={10} className="bg-[#111827]">10m</option>
                <option value={15} className="bg-[#111827]">15m</option>
                <option value={30} className="bg-[#111827]">30m</option>
                <option value={60} className="bg-[#111827]">60m</option>
              </select>
            </div>
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center justify-center p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
              title="Notification Settings"
            >
              <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </button>

            <Link
              href="/add"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-[0_0_20px_-5px_#2563eb]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Site</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* 🔹 Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Globe className="w-12 h-12" />
             </div>
            <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Total Websites</p>
            <h2 className="text-2xl md:text-3xl font-bold relative z-10">{websites.length}</h2>
          </div>
          <div className="glass-card p-4 md:p-6 rounded-2xl border-l-4 border-l-green-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Zap className="w-12 h-12 text-green-500" />
             </div>
            <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Active / Up</p>
            <h2 className="text-2xl md:text-3xl font-bold text-green-500 relative z-10">
              {websites.filter(s => s.status === 'UP').length}
            </h2>
          </div>
          <div className="glass-card p-4 md:p-6 rounded-2xl border-l-4 border-l-red-500 sm:col-span-2 lg:col-span-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertTriangle className="w-12 h-12 text-red-500" />
             </div>
            <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Outages / Down</p>
            <h2 className="text-2xl md:text-3xl font-bold text-red-500 relative z-10">
              {websites.filter(s => s.status === 'DOWN').length}
            </h2>
          </div>
        </div>

        {/* 🔹 Main Controls */}
        <div className="flex flex-row items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400 shrink-0" />
            <h2 className="text-lg font-semibold shrink-0">Monitor List</h2>
          </div>
          
          <button
            onClick={handlePing}
            disabled={loading}
            className="flex items-center gap-2 text-xs md:text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <RefreshCcw className={cn("w-3.5 h-3.5 md:w-4 h-4 text-blue-400", loading && "animate-spin")} />
            Sync <span className="hidden sm:inline">Now</span>
          </button>
        </div>

        {/* 🔹 Monitor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {websites.map((site) => (
              <motion.div
                key={site._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 md:p-5 rounded-2xl group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "w-3 h-3 rounded-full shrink-0",
                      site.status === "UP" ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                    )} />
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-base md:text-lg group-hover:text-blue-400 transition-colors truncate">{site.name}</h3>
                      <p className="text-[10px] md:text-xs text-slate-500 truncate max-w-full">{site.url}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteRequest(site._id, site.name)}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-slate-500 font-bold">Response</span>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 md:w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs md:text-sm font-semibold">{site.responseTime ? `${site.responseTime}ms` : "---"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-slate-500 font-bold">Last Check</span>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3 h-3 md:w-3.5 h-3.5" />
                      <span className="text-xs md:text-sm font-medium">
                        {site.lastChecked ? new Date(site.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                  <a 
                    href={site.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] md:text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 p-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {websites.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <Globe className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">No websites tracked yet</p>
            <Link href="/add" className="mt-4 text-sm text-blue-400 hover:underline">Start adding monitors</Link>
          </div>
        )}

        {/* 🔹 Delete Confirmation Dialog */}
        <Modal 
          isOpen={!!deleteId} 
          onClose={() => setDeleteId(null)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-500/20 rounded-2xl mb-4 border border-red-500/30">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-slate-400 mb-8 sm:px-4">
              Are you sure you want to stop monitoring <span className="text-white font-semibold">"{deleteName}"</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-all"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/20 shadow-lg active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* 🔹 Email Notification Settings Modal */}
        <EmailConfigModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </main>
    </div>
  );
}