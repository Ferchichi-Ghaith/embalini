"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, PackageCheck, CheckCircle2, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- COMPOSANT INTERNE (Logique de la page) ---
const ValideCommandContent = () => {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [orderId, setOrderId] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: ""
  });

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decodedItems = JSON.parse(atob(data));
        setItems(decodedItems);
        const sum = decodedItems.reduce((acc: number, item: any) => acc + parseFloat(item.prix_total), 0);
        setTotal(sum);
      } catch (e) {
        console.error("Erreur de décodage", e);
      }
    }
  }, [searchParams]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    const newOrderId = `ORD-${now.toString().slice(-6)}`;
    const newSecretCode = now.toString(36).slice(-6).toUpperCase();

    setOrderId(newOrderId);
    setSecretCode(newSecretCode);

    const finalCommand = {
      order_id: newOrderId,
      secret_code: newSecretCode,
      order_info: {
        ...formData,
        date: new Date().toISOString(),
        total_estimation: total.toFixed(2),
        currency: "TND",
        status: "PENDING_REVIEW"
      },
      products: items
    };

    console.log("🚀 COMMANDE GÉNÉRÉE :", finalCommand);
    setIsSubmitted(true);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("productpanierlist");
      window.dispatchEvent(new Event("cartUpdate"));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] relative overflow-hidden pt-24 pb-20 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A3E635]/15 blur-[120px] rounded-full -z-10" />
  
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-16 h-16 bg-[#A3E635] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <CheckCircle2 size={32} className="text-black" />
            </motion.div>
            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">SUCCESS</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">Request Confirmed</p>
          </div>
  
          <div className="relative group">
            <div className="bg-white border border-black/[0.04] rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
              <div className="p-6 pb-4 flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-1">Reference ID</p>
                  <p className="font-mono font-bold text-sm text-black/90">{orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-1">Wait Time</p>
                  <p className="font-bold text-sm text-black/90">~12 Hours</p>
                </div>
              </div>
  
              <div className="relative flex items-center px-2">
                <div className="absolute -left-3 w-6 h-6 bg-[#FBFBFB] rounded-full border border-black/[0.04]" />
                <div className="w-full border-t-2 border-dashed border-black/[0.06]" />
                <div className="absolute -right-3 w-6 h-6 bg-[#FBFBFB] rounded-full border border-black/[0.04]" />
              </div>
  
              <div className="p-6 pt-5">
                <p className="text-[8px] font-black uppercase tracking-widest text-center text-black/30 mb-4 italic">Tracking Secret Key</p>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigator.clipboard.writeText(secretCode)}
                  className="relative bg-black rounded-2xl p-5 cursor-pointer overflow-hidden group/code"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#A3E635]/10 to-transparent -translate-x-full group-hover/code:translate-x-full transition-transform duration-700" />
                  <div className="relative flex flex-col items-center">
                    <span className="font-mono text-3xl font-black text-[#A3E635] tracking-[0.4em] ml-[0.4em]">
                      {secretCode}
                    </span>
                    <div className="flex items-center gap-1.5 mt-2 opacity-40 group-hover/code:opacity-100 transition-opacity">
                      <Copy size={10} className="text-[#A3E635]" />
                      <span className="text-[7px] font-bold text-[#A3E635] uppercase tracking-tighter">Tap to copy</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
  
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/products">
              <Button className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-neutral-900 transition-all">
                Return to Catalog
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-20 h-20 bg-[#A3E635] rounded-full flex items-center justify-center text-black"
          >
            <PackageCheck size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter">
            Finaliser la demande<span className="text-[#A3E635]">.</span>
          </h1>
          <p className="text-black/40 font-bold uppercase text-[10px] tracking-[0.3em]">Récapitulatif de votre sélection Embalini</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-black/20" /> Votre Panier
            </h2>
            <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-xl shadow-black/2">
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length > 0 ? items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-black/5 pb-4">
                    <div className="flex items-center gap-4">
                      <img src={item.productimage || "/placeholder.png"} alt="" className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1" />
                      <div>
                        <p className="font-bold uppercase text-xs">{item.titre}</p>
                        <p className="text-[10px] text-black/40 font-bold">Qté: {item.quantite}</p>
                      </div>
                    </div>
                    <p className="font-black text-sm">{item.prix_total} TND</p>
                  </div>
                )) : (
                  <p className="text-[10px] font-bold text-black/20 uppercase italic">Aucun article détecté...</p>
                )}
              </div>
              <div className="mt-8 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase text-black/40">Total Estimation</span>
                <span className="text-4xl font-light">{total.toFixed(2)}<span className="text-sm ml-1 uppercase font-bold">Tnd</span></span>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-black/20" /> Vos Informations
            </h2>
            <form className="space-y-4" onSubmit={handleConfirm}>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="NOM" className="bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#A3E635] transition-colors shadow-sm" onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                <input required type="text" placeholder="PRÉNOM" className="bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#A3E635] transition-colors shadow-sm" onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
              </div>
              <input required type="email" placeholder="EMAIL PROFESSIONNEL" className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#A3E635] transition-colors shadow-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="TÉLÉPHONE" className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#A3E635] transition-colors shadow-sm" onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
              <textarea placeholder="MESSAGE / BESOINS SPÉCIFIQUES" rows={4} className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-[#A3E635] transition-colors shadow-sm" onChange={(e) => setFormData({...formData, message: e.target.value})} />
              <button type="submit" className="w-full py-6 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#A3E635] hover:text-black transition-all duration-500 shadow-xl shadow-black/10 active:scale-95">
                Confirmer 
              </button>
            </form>
          </section>
        </div>

        <div className="mt-20 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Retourner au catalogue
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- EXPORT PRINCIPAL (Avec le wrapper Suspense) ---
export default function ValideCommandPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
          Chargement de la session...
        </div>
      </div>
    }>
      <ValideCommandContent />
    </Suspense>
  );
}