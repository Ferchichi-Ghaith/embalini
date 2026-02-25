"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, CheckCircle2, Loader2, 
  Building2, User, Download, Sparkles, PencilLine,
  Hash, ArrowLeft, Copy
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ValideCommandContent = () => {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizationDetails, setPersonalizationDetails] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    matriculeFiscal: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  useEffect(() => {
    const localData = localStorage.getItem("productpanierlist");
    if (localData) {
      try {
        const decodedItems = JSON.parse(localData);
        setItems(decodedItems);
        const sum = decodedItems.reduce((acc: number, item: any) => acc + (parseFloat(item.prix_total) || 0), 0);
        setTotal(sum);
      } catch (e) { 
        console.error("Erreur panier:", e); 
      }
    }
  }, []);

  const generatePDF = (oId: string, sCode: string) => {
    const doc = new jsPDF();
    // --- 0. Fond de page gris très clair (#F7F7F7) ---
    // On dessine un rectangle plein sur toute la surface A4 (210x297mm)
    doc.setFillColor(247, 247, 247); // Équivalent de #F7F7F7
    doc.rect(0, 0, 210, 297, 'F');
    // --- Configuration des montants ---
    const tvaRate = 0.19;
    const fraisLivraison = 7;
    const montantTVA = total * tvaRate;
    const totalTTC = total + montantTVA + fraisLivraison;

    // --- 1. Header (Full White) ---
    const logoUrl = "/images/logodevis.png"; 
    try {
      // Largeur fixée à 85mm comme demandé
      doc.addImage(logoUrl, 'PNG', 14, 10, 85, 0); 
    } catch (e) {
      doc.setFontSize(22);
      doc.setTextColor(13, 44, 48);
      doc.setFont("helvetica", "bold");
      doc.text("EMBALINI", 14, 25);
    }
    
    // Infos Devis à droite (alignées verticalement avec le logo)
    doc.setTextColor(13, 44, 48);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DEVIS ", 196, 20, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Référence : ${oId}`, 196, 27, { align: 'right' });
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 196, 32, { align: 'right' });
    doc.text(`Code de suivi : ${sCode}`, 196, 37, { align: 'right' });

    // --- 2. Section Client (Position Y ajustée pour un grand logo) ---
    // On tire une ligne un peu plus bas pour laisser respirer le logo
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 55, 196, 55); 

    doc.setTextColor(13, 44, 48);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DESTINATAIRE", 14, 65);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    const isCompany = !!formData.companyName;
    
    // Position de départ des infos client
    let clientInfoY = 72;
    doc.text(isCompany ? `Société : ${formData.companyName}` : "Type : Client Individuel", 14, clientInfoY);
    doc.text(`Matricule Fiscal : ${formData.matriculeFiscal || "N/A"}`, 14, clientInfoY + 6);
    doc.text(`Contact : ${formData.prenom} ${formData.nom}`, 14, clientInfoY + 12);
    doc.text(`Email : ${formData.email}`, 14, clientInfoY + 18);
    doc.text(`Tél : ${formData.telephone}`, 14, clientInfoY + 24);

    // --- 3. Tableau des produits (Décalé vers le bas) ---
    autoTable(doc, {
      startY: 110, // Augmenté de 100 à 110 pour éviter les chevauchements
      head: [['Désignation', 'Quantité', 'Prix Unitaire', 'Montant Total']],
      body: items.map(item => [
        item.titre, 
        item.quantite, 
        `${parseFloat(item.prix_unitaire).toFixed(2)} TND`, 
        `${parseFloat(item.prix_total).toFixed(2)} TND`
      ]),
      headStyles: { 
        fillColor: [13, 44, 48], 
        textColor: [255, 255, 255],
        fontStyle: 'bold' 
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      styles: { fontSize: 9, cellPadding: 5 },
    });

    // --- 4. Récapitulatif Financier ---
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    
    if (isPersonalized && personalizationDetails) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("NOTES DE PERSONNALISATION :", 14, finalY);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(personalizationDetails, 110);
      doc.text(splitNotes, 14, finalY + 6);
    }

    const rightAlignX = 196;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Total Hors Taxe :`, 130, finalY, { align: 'left' });
    doc.text(`${total.toFixed(2)} TND`, rightAlignX, finalY, { align: 'right' });
    
    doc.text(`TVA (19%) :`, 130, finalY + 7, { align: 'left' });
    doc.text(`${montantTVA.toFixed(2)} TND`, rightAlignX, finalY + 7, { align: 'right' });
    
    doc.text(`Frais de livraison :`, 130, finalY + 14, { align: 'left' });
    doc.text(`${fraisLivraison.toFixed(2)} TND`, rightAlignX, finalY + 14, { align: 'right' });

    doc.setDrawColor(148, 201, 115);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 18, 196, finalY + 18);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL TTC :`, 130, finalY + 25, { align: 'left' });
    doc.text(`${totalTTC.toFixed(2)} TND`, rightAlignX, finalY + 25, { align: 'right' });

    // --- 5. Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    const footerText = "Ce document est un devis valable 30 jours. Embalini - Sustainable Packaging Range.";
    doc.text(footerText, 105, 285, { align: 'center' });

    doc.save(`Devis_Embalini_${oId}.pdf`);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);

    try {
      // 1. Get the current count from the server
      const countRes = await fetch("/api/v1/command/count");
      const { total: currentCount } = await countRes.json();

      // 2. Format the custom Order ID (ORD-26-0001)
      const yearFix = new Date().getFullYear().toString().slice(-2);
      const nextNumber = (currentCount + 1).toString().padStart(4, '0');
      const generatedOrderId = `ORD-${yearFix}-${nextNumber}`;
      
      const newSecretCode = Date.now().toString(36).slice(-6).toUpperCase();

      // 3. Prepare Payload with new fields
      const payload = {
        order_id: generatedOrderId,
        secret_code: newSecretCode,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        // Set account type based on company name presence
        accountType: formData.companyName ? "COMPANY" : "INDIVIDUAL",
        // Initial state for the 'etat' field
        etat: "EN_ATTENTE",
        // Map matricule and notes to message
        message: `MF: ${formData.matriculeFiscal || 'N/A'} | Perso: ${personalizationDetails}`,
        total_estimation: parseFloat(total.toFixed(2)),
        currency: "TND",
        items: items.map((item) => ({
          original_id: String(item.id || item._id),
          titre: item.titre,
          quantite: Number(item.quantite),
          prix_unitaire: parseFloat(item.prix_unitaire) || 0,
          prix_total: parseFloat(item.prix_total) || 0,
          productimage: item.productimage || ""
        }))
      };

      const res = await fetch("/api/v1/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de l'enregistrement");
      }

      setOrderId(generatedOrderId);
      setSecretCode(newSecretCode);
      setIsSubmitted(true);
      
      generatePDF(generatedOrderId, newSecretCode);
      
      localStorage.removeItem("productpanierlist");
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (isSubmitted) { 
    return <SuccessView orderId={orderId} secretCode={secretCode} onDownload={() => generatePDF(orderId, secretCode)} />; 
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6">
      <div className="max-w-[1300px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#0D2C30] mb-12 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#0D2C30]">Demande de Devis Officiel</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Veuillez remplir les informations de facturation</p>
              </div>
              <FileText className="text-zinc-200" size={32} />
            </div>

            <form onSubmit={handleConfirm} className="p-8 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94C973]">
                  <Building2 size={14} /> Informations Entreprise (Optionnel)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput label="Nom de la Société" placeholder="Ex: Embalini SARL" onChange={(v: string) => setFormData({...formData, companyName: v})} />
                  <CustomInput label="Matricule Fiscal" placeholder="1234567/A/M/000" icon={<Hash size={14}/>} onChange={(v: string) => setFormData({...formData, matriculeFiscal: v})} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#94C973]">
                  <User size={14} /> Contact Responsable
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput label="Nom" required placeholder="Votre nom" onChange={(v: string) => setFormData({...formData, nom: v})} />
                  <CustomInput label="Prénom" required placeholder="Votre prénom" onChange={(v: string) => setFormData({...formData, prenom: v})} />
                  <CustomInput label="Email Professionnel" required type="email" placeholder="contact@domaine.tn" onChange={(v: string) => setFormData({...formData, email: v})} />
                  <CustomInput label="Téléphone" required placeholder="+216 -- --- ---" onChange={(v: string) => setFormData({...formData, telephone: v})} />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#94C973]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0D2C30]">Personnaliser ma commande</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">Ajout de logo, marquage spécifique, etc.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-[#94C973] cursor-pointer"
                    checked={isPersonalized}
                    onChange={() => setIsPersonalized(!isPersonalized)}
                  />
                </div>

                <AnimatePresence>
                  {isPersonalized && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 p-6 bg-white border border-[#94C973]/20 rounded-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#94C973] mb-3">
                          <PencilLine size={14} /> Détails de la personnalisation
                        </div>
                        <textarea 
                          className="w-full text-sm p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:border-[#94C973] min-h-[100px] transition-all"
                          placeholder="Décrivez votre besoin..."
                          value={personalizationDetails}
                          onChange={(e) => setPersonalizationDetails(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-end pt-4">
                 <Button 
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="bg-[#0D2C30] hover:bg-[#153e43] text-white px-12 h-14 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg transition-all"
                 >
                   {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Confirmer"}
                 </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 sticky top-32">
             <div className="bg-[#0D2C30] text-white rounded-[32px] p-8 shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8">Contenu du Devis</h3>
                <div className="space-y-6 mb-10 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                   {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                           <p className="text-[11px] font-bold uppercase leading-tight">{item.titre}</p>
                           <p className="text-[9px] opacity-40 font-bold mt-1 uppercase">Qté: {item.quantite} x {item.prix_unitaire} TND</p>
                        </div>
                        <p className="text-[11px] font-black">{item.prix_total} TND</p>
                      </div>
                   ))}
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4">
                   <div className="flex justify-between items-center opacity-60">
                      <span className="text-[10px] font-bold uppercase">Total Hors Taxe</span>
                      <span className="text-xs font-bold">{total.toFixed(2)} TND</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-[#94C973]">Estimation Totale</span>
                      <span className="text-3xl font-light tracking-tighter">{total.toFixed(2)} <span className="text-sm">TND</span></span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomInput = ({ label, icon, placeholder, required = false, type = "text", onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-zinc-400 ml-1">
      {label} {required && <span className="text-[#94C973]">*</span>}
    </label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#94C973] transition-colors">{icon}</div>}
      <input 
        required={required}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full bg-white border border-zinc-200 p-4 rounded-xl text-[11px] font-bold uppercase outline-none focus:border-[#94C973] focus:ring-4 focus:ring-[#94C973]/5 transition-all",
          icon ? "pl-10" : "pl-4"
        )}
      />
    </div>
  </div>
);

const SuccessView = ({ orderId, secretCode, onDownload }: any) => (
  <div className="min-h-screen flex items-center justify-center bg-white px-6 mt-10">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg w-full">
      <div className="w-24 h-24 bg-[#94C973]/10 text-[#94C973] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <CheckCircle2 size={48} />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0D2C30] mb-4">Demande Envoyée !</h2>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-10">Votre devis a été généré avec succès</p>
      
      <div className="bg-zinc-50 border border-zinc-100 rounded-[40px] p-10 mb-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-left p-4 bg-white rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black uppercase text-zinc-300 mb-1">Référence</p>
                <p className="text-xs font-mono font-bold text-[#0D2C30]">{orderId}</p>
            </div>
            <div 
                className="text-left p-4 bg-white rounded-2xl border border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors group"
                onClick={() => {
                    navigator.clipboard.writeText(secretCode);
                    alert("Code copié !");
                }}
            >
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[8px] font-black uppercase text-zinc-300">Code Suivi</p>
                    <Copy size={10} className="text-zinc-300 group-hover:text-[#94C973]" />
                </div>
                <p className="text-xs font-mono font-bold text-[#94C973]">{secretCode}</p>
            </div>
        </div>
        <Button onClick={onDownload} className="w-full h-16 bg-[#0D2C30] hover:bg-[#1a3d42] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex gap-3">
          <Download size={18} /> Télécharger le Devis PDF
        </Button>
      </div>

      <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[#94C973] hover:underline underline-offset-4">
        Retourner à la boutique
      </Link>
    </motion.div>
  </div>
);

export default function ValideCommandPage() { 
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#94C973]"/></div>}>
      <ValideCommandContent />
    </Suspense>
  ); 
}