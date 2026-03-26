"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border glass-card min-w-[300px]",
                t.type === "success" && "border-green-500/50 bg-green-500/10",
                t.type === "error" && "border-red-500/50 bg-red-500/10",
                t.type === "info" && "border-blue-500/50 bg-blue-500/10"
              )}
            >
              {t.type === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
              
              <p className="flex-1 text-sm font-medium text-white">{t.message}</p>
              
              <button 
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
