"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  Package, Search, User, Hash, 
  ShoppingBag, ChevronRight, X, Loader2,
  Sparkles, Printer, Calendar, PhoneCall, RefreshCcw, Mail, CheckCircle2
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// UI Components
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const API_URL = "/api/v1/command"

type OrderStatus = "PENDING_REVIEW" | "CONFIRMED" | "SHIPPED" | "CANCELLED"

export default function CommandAdminPage() {
  const [commands, setCommands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState<any | null>(null)

  // États pour la confirmation Shadcn
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<{id: string, status: OrderStatus} | null>(null)

  // --- 1. Data Fetching & Mutations ---
  const fetchCommands = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setCommands(Array.isArray(data) ? data : [])
    } catch (error) { 
      console.error("Load Error:", error)
    } finally { setLoading(false) }
  }

  const handleStatusClick = (id: string, status: OrderStatus) => {
    setPendingStatus({ id, status });
    setIsConfirmOpen(true);
  }

  const executeUpdate = async () => {
    if (!pendingStatus) return;
    const { id, status } = pendingStatus;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setCommands(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        if (selectedCommand?.id === id) {
          setSelectedCommand((prev: any) => ({ ...prev, status }));
        }
      }
    } catch (error) {
      console.error("Patch Error:", error);
    } finally {
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  useEffect(() => { fetchCommands() }, [])

  // --- 2. Helpers ---
  const parseMessage = (msg: string) => {
    if (!msg) return { company: null, mf: null, perso: "Standard" };
    const companyMatch = msg.match(/Société:\s*(.*?)(?=\s*\||$)/);
    const mfMatch      = msg.match(/MF:\s*(.*?)(?=\s*\||$)/);
    const persoMatch   = msg.match(/Perso:\s*(.*)/);

    return {
      company: companyMatch ? companyMatch[1].trim() : null,
      mf:      mfMatch ? mfMatch[1].trim() : null,
      perso:   persoMatch ? persoMatch[1].trim() : "Aucune instruction particulière"
    };  
  }

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-amber-50 text-amber-600 border-amber-100";
      case "CONFIRMED":      return "bg-blue-50 text-blue-600 border-blue-100";
      case "SHIPPED":        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED":      return "bg-red-50 text-red-600 border-red-100";
      default:               return "bg-zinc-50 text-zinc-500 border-zinc-100";
    }
  }

  const getEtatBadge = (etat: string) => {
    const val = etat?.toLowerCase() || "";
    if (val.includes("neuf")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (val.includes("occasion")) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }

  // --- 3. Filter Logic ---
  const filteredCommands = useMemo(() => {
    return commands.filter(c => {
        const { company } = parseMessage(c.message);
        const searchPool = `${c.order_id} ${c.prenom} ${c.nom} ${company || ""}`.toLowerCase();
        return searchPool.includes(searchTerm.toLowerCase());
    })
  }, [commands, searchTerm])

  // --- 4. PDF Export ---
  const handlePrintPDF = (cmd: any) => {
    const doc = new jsPDF();
    const { company, mf, perso } = parseMessage(cmd.message);
    
    // --- 0. Fond de page gris très clair ---
    doc.setFillColor(247, 247, 247);
    doc.rect(0, 0, 210, 297, 'F');
  
    // --- Configuration des montants ---
    // Note: On utilise total_estimation car c'est un flux admin
    const totalHT = Number(cmd.total_estimation);
    const tvaRate = 0.19;
    const fraisLivraison = 7;
    const montantTVA = totalHT * tvaRate;
    const totalTTC = totalHT + montantTVA + fraisLivraison;
  
    // --- 1. Header ---
    const logoUrl = "/images/logodevis.png"; 
    try {
      doc.addImage(logoUrl, 'PNG', 14, 10, 85, 0); 
    } catch (e) {
      doc.setFontSize(22);
      doc.setTextColor(13, 44, 48);
      doc.setFont("helvetica", "bold");
      doc.text("EMBALINI", 14, 25);
    }
    
    doc.setTextColor(13, 44, 48);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("FICHE COMMANDE", 196, 20, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Référence : ${cmd.order_id}`, 196, 27, { align: 'right' });
    doc.text(`Date : ${new Date(cmd.createdAt).toLocaleDateString('fr-FR')}`, 196, 32, { align: 'right' });
    doc.text(`Type Compte : ${cmd.accountType === "COMPANY" || company ? "PRO" : "PARTICULIER"}`, 196, 37, { align: 'right' });
  
    // --- 2. Section Client ---
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 55, 196, 55); 
  
    doc.setTextColor(13, 44, 48);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DESTINATAIRE / INFOS ADMIN", 14, 65);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    const isCompany = cmd.accountType === "COMPANY" || !!company;
    
    let clientInfoY = 72;
    doc.text(isCompany ? `Société : ${company || "N/A"}` : "Type : Client Individuel", 14, clientInfoY);
    doc.text(`Matricule Fiscal : ${mf || "N/A"}`, 14, clientInfoY + 6);
    doc.text(`Contact : ${cmd.prenom} ${cmd.nom}`, 14, clientInfoY + 12);
    doc.text(`Email : ${cmd.email || "Non fourni"}`, 14, clientInfoY + 18);
    doc.text(`Tél : ${cmd.telephone}`, 14, clientInfoY + 24);
  
    // --- 3. Tableau des produits (Avec champ 'etat' de l'API) ---
    autoTable(doc, {
      startY: 110,
      head: [['Désignation',  'Qté', 'P.U (HT)', 'Total (HT)']],
      body: cmd.items.map((item: any) => [
        item.titre, 
       
        item.quantite, 
        `${parseFloat(item.prix_unitaire || 0).toFixed(2)} TND`, 
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
    
    // Notes de personnalisation extraites du message
    if (perso && perso !== "Standard" && perso !== "Aucune instruction particulière") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("INSTRUCTIONS DE PERSONNALISATION :", 14, finalY);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(perso, 110);
      doc.text(splitNotes, 14, finalY + 6);
    }
  
    const rightAlignX = 196;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(13, 44, 48);
    
    doc.text(`Total Hors Taxe :`, 130, finalY, { align: 'left' });
    doc.text(`${totalHT.toFixed(2)} TND`, rightAlignX, finalY, { align: 'right' });
    
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
  
    // --- 5. Footer Admin ---
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    const footerText = `Fiche générée via Admin.Flux le ${new Date().toLocaleString('fr-FR')}`;
    doc.text(footerText, 105, 285, { align: 'center' });
  
    doc.save(`Fiche_Commande_${cmd.order_id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0D2C30] font-sans pb-10">
      
      {/* Shadcn AlertDialog for Confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter">
              Confirmer le changement ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500 font-medium">
              Voulez-vous vraiment passer ce dossier au statut <span className="text-[#0D2C30] font-black italic">{pendingStatus?.status.replace('_', ' ')}</span> ? 
              Cette action sera immédiatement visible dans le flux.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-zinc-200 font-bold uppercase text-[10px]">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeUpdate}
              className="rounded-xl bg-[#0D2C30] text-[#94C973] hover:bg-[#0D2C30]/90 font-bold uppercase text-[10px]"
            >
              Confirmer la mise à jour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/60 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-[#0D2C30] p-2 rounded-lg"><Package className="text-[#94C973]" size={18} /></div>
             <h1 className="text-lg font-black tracking-tighter italic uppercase">Admin<span className="text-[#94C973]">.</span>Flux</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCommands} className="rounded-full gap-2 font-bold text-[10px] uppercase">
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                    placeholder="Filtrer par nom, société ou réf..." 
                    className="w-full pl-10 h-11 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-100 px-4 py-2 rounded-full">
                {filteredCommands.length} Dossier(s)
            </div>
        </div>

        <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="border-zinc-100">
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Réf & Statut</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Client</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest hidden md:table-cell">Compte</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest">Items</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-64 text-center"><Loader2 className="animate-spin text-[#94C973] mx-auto" size={32} /></TableCell></TableRow>
              ) : (
                filteredCommands.map((cmd) => {
                  const { company } = parseMessage(cmd.message);
                  return (
                    <TableRow 
                      key={cmd.id} 
                      className="cursor-pointer hover:bg-zinc-50/80 transition-colors group"
                      onClick={() => { setSelectedCommand(cmd); setIsDrawerOpen(true); }}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="font-mono font-bold text-[11px] text-zinc-400">#{cmd.order_id}</span>
                            <Badge className={`text-[8px] font-black border uppercase w-fit px-1.5 py-0 ${getStatusBadgeStyles(cmd.status)}`}>
                                {cmd.status?.replace('_', ' ') || "NEW"}
                            </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm uppercase leading-tight">{cmd.prenom} {cmd.nom}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">{cmd.telephone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {cmd.accountType === "COMPANY" || company ? (
                            <Badge className="bg-[#0D2C30] text-[#94C973] text-[9px] font-black uppercase px-2 py-0">PRO</Badge>
                        ) : (
                            <Badge variant="outline" className="text-zinc-400 border-zinc-200 text-[9px] font-black uppercase">PARTICULIER</Badge>
                        )}
                      </TableCell>
                      <TableCell><div className="flex items-center gap-1.5 text-xs font-bold"><ShoppingBag size={12} className="text-[#94C973]" /> {cmd.items?.length || 0}</div></TableCell>
                      <TableCell className="text-right font-mono font-black text-sm">{Number(cmd.total_estimation).toLocaleString()} TND</TableCell>
                      <TableCell><ChevronRight size={16} className="text-zinc-300 group-hover:text-[#0D2C30]" /></TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[96vh] bg-[#FBFBFB] border-none rounded-t-[40px]">
          <div className="mx-auto w-full max-w-5xl px-6 pb-12 overflow-y-auto">
            {selectedCommand && (() => {
                const { company, mf, perso } = parseMessage(selectedCommand.message);
                const statuses: OrderStatus[] = ["PENDING_REVIEW", "CONFIRMED", "SHIPPED", "CANCELLED"];
                return (
                    <>
                    <DrawerHeader className="px-0 py-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <DrawerTitle className="text-4xl font-black italic uppercase tracking-tighter">Détails Dossier</DrawerTitle>
                                <div className="flex items-center gap-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2">
                                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(selectedCommand.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><Hash size={14}/> {selectedCommand.order_id}</span>
                                </div>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setIsDrawerOpen(false)} className="rounded-full"><X size={20} /></Button>
                        </div>
                    </DrawerHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: Client & Action Card */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-[#0D2C30] text-white p-6 rounded-[32px] shadow-xl">
                                <h4 className="text-[10px] font-black uppercase text-[#94C973] mb-6 flex items-center gap-2 tracking-widest italic">
                                    <CheckCircle2 size={16}/> Gestion du Statut
                                </h4>
                                
                                <div className="grid grid-cols-1 gap-2 mb-8">
                                    {statuses.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusClick(selectedCommand.id, s)}
                                            className={`text-[9px] font-black py-3 px-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                                                selectedCommand.status === s 
                                                ? "bg-[#94C973] text-[#0D2C30] border-[#94C973]" 
                                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                            }`}
                                        >
                                            {s.replace('_', ' ')}
                                            {selectedCommand.status === s && <CheckCircle2 size={14} />}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-6">
                                    <p className="text-[9px] opacity-40 uppercase font-bold tracking-widest leading-none mb-1">Contact Principal</p>
                                    <p className="text-xl font-black uppercase leading-tight">{selectedCommand.prenom} {selectedCommand.nom}</p>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="secondary" className="bg-white/10 text-white font-bold uppercase text-[10px] rounded-xl h-10 justify-start">
                                            <PhoneCall size={14} className="mr-2 text-[#94C973]" /> {selectedCommand.telephone}
                                        </Button>
                                        <Button variant="secondary" className="bg-white/10 text-white font-bold uppercase text-[10px] rounded-xl h-10 justify-start">
                                            <Mail size={14} className="mr-2 text-[#94C973]" /> {selectedCommand.email || "Non fourni"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Items & Summary */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#94C973]/10 border-2 border-dashed border-[#94C973]/30 p-6 rounded-[32px]">
                                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-3"><Sparkles size={16}/> Instructions</h4>
                                <div className="bg-white p-5 rounded-2xl text-sm font-bold italic border border-zinc-100">"{perso}"</div>
                            </div>

                            <div className="space-y-3">
                                {selectedCommand.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-5">
                                        <div className="h-14 w-14 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0">
                                            {item.productimage ? <img src={item.productimage} className="h-full w-full object-contain p-2" /> : <Package size={20} className="text-zinc-200" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-black text-xs uppercase truncate mb-1">{item.titre}</h5>
                                            <Badge variant="outline" className={`text-[8px] font-black border-none uppercase py-0 px-2 ${getEtatBadge(item.etat)}`}>{item.etat || "Neuf"}</Badge>
                                        </div>
                                        <div className="text-right font-mono font-black text-sm">{Number(item.prix_total).toLocaleString()} TND</div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#0D2C30] p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mt-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#94C973] mb-1 leading-none">Total HT Estimé</p>
                                    <h3 className="text-4xl font-black italic text-white tracking-tighter">
                                        {Number(selectedCommand.total_estimation).toLocaleString()} <span className="text-lg opacity-30 italic font-medium">TND</span>
                                    </h3>
                                </div>
                                <Button onClick={() => handlePrintPDF(selectedCommand)} className="bg-[#94C973] hover:bg-[#85b565] text-[#0D2C30] rounded-2xl font-black uppercase text-[11px] h-14 px-8 tracking-widest">
                                    <Printer size={18} className="mr-2" /> Exporter PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                    </>
                )
            })()}
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  )
}