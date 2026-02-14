"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ChevronLeft, 
  Hash, 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Loader2,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * CONFIGURATION DES STATUTS
 * Utilise le champ "etat" de la data API
 */
const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING_REVIEW: { label: "En attente", color: "text-amber-600", bgColor: "bg-amber-50", icon: Clock },
  CONFIRMED: { label: "Confirmée", color: "text-blue-600", bgColor: "bg-blue-50", icon: CheckCircle2 },
  SHIPPED: { label: "Expédiée", color: "text-emerald-600", bgColor: "bg-emerald-50", icon: Package },
  CANCELLED: { label: "Annulée", color: "text-red-600", bgColor: "bg-red-50", icon: XCircle },
};

export default function CheckCommandPage() {
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretCode) return;
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/v1/command/${secretCode}`);
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || "Code introuvable.");
        setOrder(null);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 md:pt-32 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-black"
          >
            SUIVI <span className="text-[#A3E635]">EXPRESS</span>
          </motion.h1>
          <p className="mt-2 font-black uppercase tracking-[0.2em] text-[9px] md:text-xs">
            Vérifiez l'état de votre devis Embalini
          </p>
        </div>

        {/* SEARCH FORM (Hidden when order is displayed) */}
        {!order && (
          <motion.div layout className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#A3E635] rounded-[2rem] blur opacity-10 group-within:opacity-30 transition duration-500"></div>
              <form 
                onSubmit={handleSearch} 
                className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-3xl sm:rounded-[2.2rem] shadow-xl border border-black/5 p-2 gap-2"
              >
                <div className="flex items-center flex-1 px-4">
                  <Hash size={20} className="text-gray-300 hidden sm:block" />
                  <Input
                    placeholder="CODE SECRET"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value.toUpperCase())}
                    className="h-12 border-none bg-transparent shadow-none text-base md:text-xl font-[1000] focus-visible:ring-0 placeholder:text-gray-200 uppercase"
                  />
                </div>
                <Button 
                  disabled={loading || !secretCode}
                  className="h-12 mr-3 px-4   font-black uppercase italic "
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Search size={20} strokeWidth={3} />}
                </Button>
              </form>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 font-bold text-[10px] mt-4 uppercase italic">
                {error}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <button 
                onClick={() => setOrder(null)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors bg-white px-4 py-2 rounded-full shadow-sm"
              >
                <ChevronLeft size={14} /> Nouvelle recherche
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SIDEBAR: INFO & ETAT */}
                <div className="lg:col-span-4 space-y-4">
                  <Card className="rounded-[32px] border-none shadow-xl bg-black text-white">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-row lg:flex-col justify-between items-start lg:gap-8">
                        <div>
                          <p className="text-[#A3E635] text-[10px] font-black uppercase tracking-widest mb-2">État de traitement</p>
                          {(() => {
                            const config = statusConfig[order.status] || { label: order.etat, color: "text-white", bgColor: "bg-white/10", icon: AlertCircle };
                            const Icon = config.icon;
                            return (
                              <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl", config.bgColor)}>
                                <Icon size={14} className={config.color} />
                                <span className={cn("text-xs font-black uppercase italic", config.color)}>{config.label}</span>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-right lg:text-left mt-0 lg:mt-4">
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">ID Devis</p>
                          <span className="font-mono text-xs opacity-80">#{order.order_id}</span>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                          {order.user?.accountType === "COMPANY" ? (
                            <Building2 size={16} className="text-[#A3E635]" />
                          ) : (
                            <User size={16} className="text-[#A3E635]" />
                          )}
                          <span className="font-bold text-sm truncate">{order.nom} {order.prenom}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-[#A3E635]" />
                          <span className="text-xs opacity-60">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* MINI CONTACT CARD */}
                  <Card className="rounded-3xl border-none shadow-sm bg-white p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                        <Phone size={14} className="text-gray-300" /> {order.telephone}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600 truncate">
                        <Mail size={14} className="text-gray-300" /> {order.email}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* MAIN CONTENT: ARTICLES */}
                <div className="lg:col-span-8 space-y-6">
                  <Card className="rounded-[32px] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6 md:p-10">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-[1000] uppercase italic">Récapitulatif</h3>
                        <span className="text-[10px] font-black bg-gray-50 px-3 py-1 rounded-full text-gray-400">
                          {order.items?.length || 0} ITEMS
                        </span>
                      </div>
                      
                      <div className="space-y-4 divide-y divide-gray-50">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 pt-4 first:pt-0">
                            <div className="h-16 w-16 bg-[#F8FAFC] rounded-2xl p-2 flex-shrink-0 border border-gray-100">
                              <img src={item.productimage || "/placeholder.png"} alt="" className="h-full w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] md:text-sm font-black uppercase truncate text-black">{item.titre}</h4>
                              <p className="text-[10px] font-bold mt-1">
                                {item.quantite} UNITÉS × {item.prix_unitaire} {order.currency}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-[1000] italic text-sm">{item.prix_total} {order.currency}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* TOTAL BOX */}
                      <div className="mt-10 bg-[#A3E635]/10 p-6 rounded-[2rem] border border-[#A3E635]/20">
                        <div className="flex justify-between items-end">
                          <span className="font-black uppercase italic text-[10px] text-black/90">Estimation Totale TTC</span>
                          <span className="text-3xl md:text-4xl font-[1000] italic tracking-tighter text-black">
                            {order.total_estimation} <span className="text-lg md:text-xl not-italic uppercase">{order.currency}</span>
                          </span>
                        </div>
                      </div>

                      {order.message && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border-l-4 border-black/5">
                          <p className="text-[9px] font-black uppercase mb-1">Note client</p>
                          <p className="text-xs italic text-gray-700">"{order.message}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}