"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Package, Search, User, Hash, 
  ShoppingBag, ChevronRight, X, Loader2, Building2, User2,
  Sparkles, Printer, Calendar, PhoneCall, RefreshCcw, ExternalLink, Mail
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// UI Components
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const API_URL = "/api/v1/command"

type OrderStatus = "PENDING_REVIEW" | "CONFIRMED" | "SHIPPED" | "CANCELLED"

export default function CommandAdminPage() {
  const [commands, setCommands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState<any | null>(null)

  // 1. Data Fetching
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

  useEffect(() => { fetchCommands() }, [])

  // 2. Parsing Logic
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

  const getEtatBadge = (etat: string) => {
    const val = etat?.toLowerCase() || "";
    if (val.includes("neuf")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (val.includes("occasion")) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }

  // 3. Search Filter
  const filteredCommands = useMemo(() => {
    return commands.filter(c => {
        const { company } = parseMessage(c.message);
        const searchPool = `${c.order_id} ${c.prenom} ${c.nom} ${company || ""}`.toLowerCase();
        return searchPool.includes(searchTerm.toLowerCase());
    })
  }, [commands, searchTerm])

  // 4. PDF Export
  const handlePrintPDF = (cmd: any) => {
    const doc = new jsPDF();
    const { company, mf, perso } = parseMessage(cmd.message);
    
    doc.setFillColor(13, 44, 48); 
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("EMBALINI", 15, 22);
    doc.setFontSize(9);
    doc.text("FICHE ADMINISTRATIVE DE COMMANDE", 15, 30);
    
    doc.setFontSize(10);
    doc.text(`REF: ${cmd.order_id}`, 140, 22);
    doc.text(`DATE: ${new Date(cmd.createdAt).toLocaleDateString('fr-FR')}`, 140, 28);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS CLIENT", 15, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom: ${cmd.prenom} ${cmd.nom}`, 15, 70);
    doc.text(`Téléphone: ${cmd.telephone}`, 15, 76);
    if(company) doc.text(`Société: ${company}`, 15, 82);
    if(mf) doc.text(`MF: ${mf}`, 15, 88);

    autoTable(doc, {
      startY: 100,
      head: [['Désignation', 'État', 'Qté', 'Total (TND)']],
      body: cmd.items.map((item: any) => [
        item.titre, 
        item.etat || "Neuf",
        item.quantite, 
        `${item.prix_total} TND`
      ]),
      headStyles: { fillColor: [148, 201, 115], textColor: [13, 44, 48] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIONS DE PERSONNALISATION :", 15, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(perso, 5000), 15, finalY + 7);

    doc.setFontSize(14);
    doc.text(`TOTAL ESTIMÉ: ${cmd.total_estimation} TND`, 130, finalY + 25);

    doc.save(`Embalini_${cmd.order_id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0D2C30] font-sans pb-10">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/60 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-[#0D2C30] p-2 rounded-lg">
                <Package className="text-[#94C973]" size={18} />
             </div>
             <h1 className="text-lg font-black tracking-tighter italic uppercase">Admin<span className="text-[#94C973]">.</span>Flux</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCommands} className="rounded-full gap-2 font-bold text-[10px] uppercase">
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input 
                    placeholder="Filtrer par nom, société ou réf..." 
                    className="pl-10 h-11 rounded-xl border-zinc-200 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-100 px-4 py-2 rounded-full">
                {filteredCommands.length} Dossier(s) Trouvé(s)
            </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-100">
                <TableHead className="w-[100px] font-black text-[10px] uppercase tracking-widest text-zinc-400">Réf</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Client</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-zinc-400 hidden md:table-cell">Compte</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Items</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-zinc-400">Total Estimation</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <Loader2 className="animate-spin text-[#94C973] mx-auto" size={32} />
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommands.map((cmd) => {
                  const { company } = parseMessage(cmd.message);
                  const isCompany = cmd.accountType === "COMPANY" || !!company;

                  return (
                    <TableRow 
                      key={cmd.id} 
                      className="cursor-pointer hover:bg-zinc-50/80 transition-colors group"
                      onClick={() => { setSelectedCommand(cmd); setIsDrawerOpen(true); }}
                    >
                      <TableCell className="font-mono font-bold text-[11px] text-zinc-400">
                        #{cmd.order_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm uppercase leading-tight">{cmd.prenom} {cmd.nom}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">{cmd.telephone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {isCompany ? (
                            <div className="flex items-center gap-2">
                                <Badge className="bg-[#0D2C30] text-[#94C973] border-none text-[9px] font-black uppercase px-2 py-0">
                                    SOCIÉTÉ
                                </Badge>
                                <span className="text-[10px] font-bold text-zinc-500 truncate max-w-[120px]">{company || "Non spécifié"}</span>
                            </div>
                        ) : (
                            <Badge variant="outline" className="text-zinc-400 border-zinc-200 text-[9px] font-black uppercase">PARTICULIER</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1.5 text-xs font-bold">
                            <ShoppingBag size={12} className="text-[#94C973]" />
                            {cmd.items?.length || 0}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <span className="font-mono font-black text-sm text-[#0D2C30]">
                            {Number(cmd.total_estimation).toLocaleString()} <span className="text-[10px] opacity-40">TND</span>
                         </span>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-[#94C973]/20 transition-colors">
                            <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#0D2C30]" />
                        </div>
                      </TableCell>
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
            <DrawerHeader className="px-0 py-8">
               <div className="flex justify-between items-start">
                  <div>
                    <DrawerTitle className="text-4xl font-black italic uppercase tracking-tighter">Détails Dossier</DrawerTitle>
                    <div className="flex items-center gap-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedCommand && new Date(selectedCommand.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Hash size={14}/> {selectedCommand?.order_id}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setIsDrawerOpen(false)} className="rounded-full">
                    <X size={20} />
                  </Button>
               </div>
            </DrawerHeader>

            {selectedCommand && (() => {
                const { company, mf, perso } = parseMessage(selectedCommand.message);
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT: Client Card */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#0D2C30] text-white p-6 rounded-[32px] shadow-xl">
                                <h4 className="text-[10px] font-black uppercase text-[#94C973] mb-6 flex items-center gap-2 tracking-widest italic">
                                    <User size={16}/> Profil Client
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] opacity-40 uppercase font-bold tracking-widest leading-none mb-1">Responsable</p>
                                        <p className="text-xl font-black uppercase leading-tight">{selectedCommand.prenom} {selectedCommand.nom}</p>
                                    </div>
                                    {company && (
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                            <p className="text-[9px] opacity-40 uppercase font-bold tracking-widest">Entreprise</p>
                                            <p className="text-sm font-bold text-[#94C973] uppercase leading-tight mt-1">{company}</p>
                                            <p className="text-[10px] font-mono opacity-60 mt-1">MF: {mf || "N/A"}</p>
                                        </div>
                                    )}
                                    <div className="pt-2 flex flex-col gap-2">
                                        <Button  variant="secondary" className="bg-[#94C973] text-[#0D2C30] hover:bg-[#85b565] font-black uppercase text-[10px] rounded-xl h-12">
                                            <PhoneCall size={14} className="mr-2" /> {selectedCommand.telephone}
                                        </Button>
                                            
                                            <Button  variant="secondary" className="bg-[#94C973] text-[#0D2C30] hover:bg-[#85b565] font-black uppercase text-[10px] rounded-xl h-12">
                                            <Mail size={12} /> {selectedCommand.email || "Email non fourni"}
                                        </Button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Items & Notes */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#94C973]/10 border-2 border-dashed border-[#94C973]/30 p-6 rounded-[32px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={16} className="text-[#0D2C30]" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">Note Perso / Instructions</h4>
                                </div>
                                <div className="bg-white p-5 rounded-2xl text-sm font-bold italic text-[#0D2C30]/80 border border-zinc-100">
                                    "{perso}"
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase text-zinc-400 px-2 tracking-widest flex items-center gap-2">
                                    <ShoppingBag size={14}/> Liste des Articles ({selectedCommand.items?.length})
                                </h4>
                                {selectedCommand.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-5">
                                        <div className="h-16 w-16 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center shrink-0">
                                            {item.productimage ? <img src={item.productimage} className="h-full w-full object-contain p-2" /> : <Package size={20} className="text-zinc-200" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-black text-xs uppercase truncate leading-tight mb-1">{item.titre}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className={`text-[8px] font-black border-none uppercase py-0 px-2 ${getEtatBadge(item.etat)}`}>
                                                    {item.etat || "Neuf"}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-zinc-400 italic">Qté: {item.quantite}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-black text-sm">{item.prix_total} TND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions & Summary */}
                            <div className="bg-[#0D2C30] p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mt-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#94C973] mb-1 leading-none">Estimation Totale HT</p>
                                    <h3 className="text-4xl font-black italic text-white tracking-tighter">
                                        {Number(selectedCommand.total_estimation).toLocaleString()} <span className="text-lg opacity-30 italic font-medium">TND</span>
                                    </h3>
                                </div>
                                <Button onClick={() => handlePrintPDF(selectedCommand)} className="bg-[#94C973] hover:bg-[#85b565] text-[#0D2C30] rounded-2xl font-black uppercase text-[11px] h-14 px-8 tracking-widest w-full md:w-auto shadow-lg shadow-[#94C973]/20">
                                    <Printer size={18} className="mr-2" /> Imprimer Fiche PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })()}
          </div>
        </DrawerContent>
      </Drawer>

    </div>
  )
}