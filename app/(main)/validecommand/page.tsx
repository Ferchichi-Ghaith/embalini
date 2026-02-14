"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PackageCheck, CheckCircle2, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- COMPOSANT INTERNE (Logique de la page) ---
const ValideCommandContent = () => {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [orderId, setOrderId] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: ""
  });

  // Charger le panier depuis le localStorage
  useEffect(() => {
    const localData = localStorage.getItem("productpanierlist");
    if (localData) {
      try {
        const decodedItems = JSON.parse(localData);
        setItems(decodedItems);
        const sum = decodedItems.reduce((acc: number, item: any) => {
          const price = parseFloat(item.prix_total) || 0;
          return acc + price;
        }, 0);
        setTotal(sum);
      } catch (e) {
        console.error("Erreur de lecture du panier local", e);
      }
    }
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Génération des identifiants (côté client pour l'affichage immédiat)
    const now = Date.now();
    const newOrderId = `ORD-${now.toString().slice(-6)}`;
    const newSecretCode = now.toString(36).slice(-6).toUpperCase();

    // Construction du payload pour correspondre à votre schéma Elysia (t.Object)
    const payload = {
      order_id: newOrderId,
      secret_code: newSecretCode,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      message: formData.message || "",
      total_estimation: parseFloat(total.toFixed(2)),
      currency: "TND",
      // Mapping des items pour correspondre à Prisma items.create
      items: items.map((item) => ({
        original_id: String(item.id || item._id || "REF-000"),
        titre: item.titre,
        quantite: Number(item.quantite),
        prix_unitaire: parseFloat(item.prix_unitaire) || 0,
        prix_total: parseFloat(item.prix_total) || 0,
        productimage: item.productimage || ""
      }))
    };

    try {
      const response = await fetch("/api/v1/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save order");
      }

      // Succès : Nettoyage et redirection visuelle
      setOrderId(newOrderId);
      setSecretCode(newSecretCode);
      setIsSubmitted(true);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("productpanierlist");
        window.dispatchEvent(new Event("cartUpdate"));
      }
    } catch (error) {
      console.error("❌ Erreur lors de la commande:", error);
      alert("Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VUE SUCCÈS ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] relative overflow-hidden pt-24 pb-20 px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A3E635]/15 blur-[120px] rounded-full -z-10" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm w-full">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-[#A3E635] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 size={32} className="text-black" />
            </motion.div>
            <h1 className="text-3xl font-[1000] uppercase italic tracking-tighter">SUCCESS</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">Demande enregistrée en base</p>
          </div>
          <div className="bg-white border border-black/4 rounded-[32px] overflow-hidden shadow-xl p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-black/30 mb-1">ID Commande</p>
                <p className="font-mono font-bold text-sm text-black/90">{orderId}</p>
              </div>
            </div>
            <div className="p-5 bg-black rounded-2xl flex flex-col items-center gap-2 cursor-pointer group" onClick={() => navigator.clipboard.writeText(secretCode)}>
              <span className="text-[8px] font-bold text-[#A3E635]/60 uppercase tracking-widest">Code de suivi</span>
              <span className="font-mono text-3xl font-black text-[#A3E635] tracking-[0.4em] ml-[0.4em]">{secretCode}</span>
              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                 <Copy size={10} className="text-[#A3E635]" />
                 <span className="text-[7px] font-bold text-[#A3E635] uppercase">Copier</span>
              </div>
            </div>
          </div>
          <Link href="/products" className="block mt-8">
            <Button className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-900">
              Retour au catalogue
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- VUE FORMULAIRE ---
  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-[#A3E635] rounded-full flex items-center justify-center text-black">
            <PackageCheck size={40} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter">
            Finaliser la demande<span className="text-[#A3E635]">.</span>
          </h1>
          <p className="text-black/40 font-bold uppercase text-[10px] tracking-[0.3em]">Enregistrement sécurisé de votre devis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Section Panier */}
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-black/20" /> Récapitulatif
            </h2>
            <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-xl">
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
                )) : <p className="text-[10px] font-bold text-black/20 uppercase">Vide...</p>}
              </div>
              <div className="mt-8 flex justify-between items-end border-t pt-6 border-black/5">
                <span className="text-[10px] font-bold uppercase text-black/40">Total Estimé</span>
                <span className="text-4xl font-light">{total.toFixed(2)}<span className="text-sm ml-1 font-bold">TND</span></span>
              </div>
            </div>
          </section>

          {/* Section Formulaire */}
          <section className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-black/20" /> Vos Coordonnées
            </h2>
            <form className="space-y-4" onSubmit={handleConfirm}>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="NOM" className="bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-[#A3E635] transition-colors" onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                <input required type="text" placeholder="PRÉNOM" className="bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-[#A3E635] transition-colors" onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
              </div>
              <input required type="email" placeholder="EMAIL" className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-[#A3E635] transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="TÉLÉPHONE" className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-[#A3E635] transition-colors" onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
              <textarea placeholder="MESSAGE (FACULTATIF)" rows={4} className="w-full bg-white border border-black/5 p-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-[#A3E635] transition-colors" onChange={(e) => setFormData({...formData, message: e.target.value})} />
              
              <button 
                type="submit" 
                disabled={isSubmitting || items.length === 0}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 shadow-xl flex items-center justify-center gap-2 
                ${isSubmitting ? 'bg-neutral-800 text-white cursor-wait' : 'bg-black text-[#A3E635] hover:bg-[#A3E635] hover:text-black active:scale-95'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Traitement...
                  </>
                ) : "Confirmer la commande"}
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

// --- EXPORT PRINCIPAL ---
export default function ValideCommandPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-black/20">
          Initialisation sécurisée...
        </div>
      </div>
    }>
      <ValideCommandContent />
    </Suspense>
  );
}