  "use client";

import { useState } from "react";
import { addWebsite } from "@/services/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Globe, Layout, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AddPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) {
      toast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await addWebsite({ name, url });
      toast("Website added successfully", "success");
      router.push("/");
    } catch (err) {
      toast("Failed to add website", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 bg-blue-600/20 rounded-2xl mb-4 border border-blue-500/30">
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">New Monitor</h1>
            <p className="text-slate-400 text-sm mt-1">Start tracking a new digital asset</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Display Name
              </label>
              <div className="relative group">
                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="My Portfolio"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Website URL
              </label>
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Monitor
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
