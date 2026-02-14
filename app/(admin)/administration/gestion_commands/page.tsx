"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Package, Search, Trash2, ExternalLink, 
  Clock, CheckCircle2, Truck, AlertCircle,
  User, Phone, Mail, Hash, CreditCard, ShoppingBag,
  ChevronRight, X, Loader2, Filter, Building2, User2,
  Ban, Check
} from "lucide-react"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = "/api/v1/command"

// Type basé sur ton Enum
type OrderStatus = "PENDING_REVIEW" | "CONFIRMED" | "SHIPPED" | "CANCELLED"

export default function CommandAdminPage() {
  const [commands, setCommands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState<any | null>(null)
  const [statusToUpdate, setStatusToUpdate] = useState<{id: string, status: OrderStatus} | null>(null)

  const fetchCommands = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      console.log(data)
      setCommands(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { fetchCommands() }, [])

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        
        if (selectedCommand && selectedCommand.id === id) {
          setSelectedCommand({...selectedCommand, status: newStatus})
        }
        fetchCommands()
      }
    } catch (error) { console.error(error) }
  }

  const confirmStatusChange = async () => {
    if (statusToUpdate) {
      await updateStatus(statusToUpdate.id, statusToUpdate.status)
      setStatusToUpdate(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      setCommands(prev => prev.filter(c => c.id !== id))
    } catch (e) { fetchCommands() }
  }

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_REVIEW": return "En Révision"
      case "CONFIRMED": return "Confirmée"
      case "SHIPPED": return "Expédiée"
      case "CANCELLED": return "Annulée"
      default: return status
    }
  }

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-orange-50 text-orange-600 border-orange-100"
      case "CONFIRMED": return "bg-emerald-50 text-emerald-600 border-emerald-100"
      case "SHIPPED": return "bg-blue-50 text-blue-600 border-blue-100"
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100"
      default: return "bg-zinc-50 text-zinc-600 border-zinc-100"
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      <main className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-zinc-100 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Commandes.</h1>
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Gestion du flux de production</p>
          </div>
       
        </header>

        {/* Tableau */}
        <div className="rounded-xl border border-zinc-100 shadow-2xl shadow-zinc-100/50 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4 text-[10px] font-black uppercase text-zinc-500">N° Commande</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Client </TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Articles</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Total</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Statut</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase text-zinc-500">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="h-60 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" /></TableCell></TableRow>
                  ) : commands.map((cmd) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={cmd.id} className="group border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="pl-6 font-mono text-[11px] font-bold text-zinc-400">#{cmd.order_id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-zinc-800">{cmd.prenom} {cmd.nom}</span>
                         <span className=" text-sm text-zinc-800">{cmd.email} </span>

                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full px-2 py-0 text-[10px] font-bold border-zinc-200">{cmd.items?.length || 0} Prod.</Badge></TableCell>
                      <TableCell className="font-mono font-black text-sm text-zinc-900">{Number(cmd.total_estimation).toLocaleString('fr-TN')} <span className="text-[10px] font-normal">{cmd.currency}</span></TableCell>
                      <TableCell>
                        <Badge className={`rounded-full shadow-none border font-bold text-[9px] uppercase tracking-wider ${getStatusStyle(cmd.status)}`}>
                          {getStatusLabel(cmd.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-900 hover:text-white" onClick={() => { setSelectedCommand(cmd); setIsOpen(true); }}><ChevronRight className="h-4 w-4" /></Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Détails Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-t-[32px] border-none shadow-2xl max-h-[96vh]">
          <DrawerHeader className="sr-only"><DrawerTitle>Fiche Commande</DrawerTitle></DrawerHeader>
          <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-12 overflow-y-auto">
            {selectedCommand && (
              <div className="space-y-10">
                <header className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-zinc-900 text-white rounded-md px-3 py-1 text-[10px]">ADMINISTRATION</Badge>
                    <h2 className="text-5xl font-black italic tracking-tighter">#{selectedCommand.order_id}</h2>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <Select 
                      value={selectedCommand.status} 
                      onValueChange={(val: OrderStatus) => setStatusToUpdate({ id: selectedCommand.id, status: val })}
                    >
                      <SelectTrigger className="w-[220px] rounded-xl h-12 font-bold uppercase text-[10px] border-2 border-zinc-100 bg-white">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-100 rounded-xl border-zinc-100">
                        <SelectItem value="PENDING_REVIEW" className="text-[10px] font-bold uppercase">⏳ En Révision</SelectItem>
                        <SelectItem value="CONFIRMED" className="text-[10px] font-bold uppercase text-emerald-600">✅ Confirmée</SelectItem>
                        <SelectItem value="SHIPPED" className="text-[10px] font-bold uppercase text-blue-600">🚚 Expédiée</SelectItem>
                        <SelectItem value="CANCELLED" className="text-[10px] font-bold uppercase text-red-600">🚫 Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Colonne Gauche - Client */}
                  <div className="col-span-1 space-y-6">
                    <section className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-2 flex items-center gap-2"><User className="w-3 h-3"/> Client</h4>
                      <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Nom Complet</p><p className="font-bold">{selectedCommand.prenom} {selectedCommand.nom}</p></div>
                      <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Téléphone</p><p className="text-sm font-mono font-bold">{selectedCommand.telephone}</p></div>
                      <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Email</p><p className="text-xs break-all underline">{selectedCommand.email}</p></div>
                    </section>
                    
                    <section className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
                      <h4 className="text-[10px] font-black uppercase text-blue-400 mb-2 flex items-center gap-2"><Mail className="w-3 h-3"/> Note Client</h4>
                      <p className="italic text-sm text-blue-900 leading-relaxed">"{selectedCommand.message || "Aucune instruction particulière."}"</p>
                    </section>
                  </div>

                  {/* Colonne Droite - Articles */}
                  <div className="col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2"><ShoppingBag className="w-3 h-3"/> Panier</h4>
                    <div className="space-y-3">
                      {selectedCommand.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white border border-zinc-100 p-3 rounded-2xl">
                          <div className="h-16 w-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-50">
                             <img src={item.productimage} className="h-full w-full object-cover" alt={item.titre} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate uppercase tracking-tighter">{item.titre}</h5>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[8px] font-bold px-1.5 py-0">{item.etat || 'NEUF'}</Badge>
                                <p className="text-[10px] text-zinc-400 font-bold tracking-tighter">QTÉ : {item.quantite} X {item.prix_unitaire}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-black text-sm">{Number(item.prix_total).toLocaleString('fr-TN')} <span className="text-[9px]">TND</span></p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900 text-white rounded-3xl p-8 flex justify-between items-center">
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Montant Total Estimé</p>
                         <h3 className="text-4xl font-black italic">{Number(selectedCommand.total_estimation).toLocaleString('fr-TN')} {selectedCommand.currency}</h3>
                       </div>
                       <CreditCard className="w-10 h-10 text-zinc-800" />
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Alerte Confirmation Statut */}
      <AlertDialog open={!!statusToUpdate} onOpenChange={(open) => !open && setStatusToUpdate(null)}>
        <AlertDialogContent className="rounded-3xl border-none">
          <AlertDialogHeader className="items-center text-center">
            <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2 text-zinc-900">
               <AlertCircle className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Mise à jour</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Confirmez-vous le passage au statut <br/>
              <span className="font-black text-zinc-900 text-lg uppercase underline decoration-zinc-200">
                {statusToUpdate && getStatusLabel(statusToUpdate.status)}
              </span> ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel className="rounded-xl border-none bg-zinc-50" onClick={() => setStatusToUpdate(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-zinc-900 text-white rounded-xl px-8" onClick={confirmStatusChange}>Valider le changement</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}