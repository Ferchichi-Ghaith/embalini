"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Upload, Loader2, 
  X, Save, Hash, AlignLeft, Euro, Image as ImageIcon,
  Settings2
} from "lucide-react"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const API_URL = "/api/v1/produit"

interface Spec {
  label: string;
  value: string;
}

export default function ProductAdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",  
    price: "", 
    image: "",
    description: "",
    specs: [] as Spec[]
  })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSave = async () => {
    setIsSubmitting(true)
    const method = selectedProduct ? "PATCH" : "POST"
    const url = selectedProduct ? `${API_URL}/${selectedProduct.id}` : API_URL
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) })
      })
      if (response.ok) { setIsOpen(false); fetchProducts() }
    } catch (error) { console.error(error) } finally { setIsSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    try { await fetch(`${API_URL}/${id}`, { method: "DELETE" }) } catch (e) { fetchProducts() }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      <main className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-6">
        
        {/* Simple & Bold Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Inventory.</h1>
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Database Management System</p>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedProduct(null)
              setFormData({ title: "", price: "", image: "", description: "", specs: [] })
              setIsOpen(true)
            }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 h-12 shadow-xl transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Product
          </Button>
        </header>

        {/* Dense Data Table */}
        <div className="rounded-xl border border-zinc-100 shadow-2xl shadow-zinc-100/50 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] pl-6 py-4 text-[10px] font-black uppercase text-zinc-500">Preview</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Title</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Description</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Specifications</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Price</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase text-zinc-500">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="h-60 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" /></TableCell></TableRow>
                  ) : products.map((item) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={item.id} 
                      className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img src={item.image || "/placeholder.png"} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-sm tracking-tight text-zinc-800">{item.title}</TableCell>
                      <TableCell className="max-w-[250px]">
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {item.description || "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[300px]">
                          {item.specs?.length > 0 ? item.specs.map((s: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-200 bg-white text-zinc-600 font-medium">
                              {s.label}: {s.value}
                            </Badge>
                          )) : <span className="text-zinc-300 text-[10px]">No specs</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-black text-sm text-zinc-900">
                        {item.price?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setFormData({ ...item, price: item.price.toString() });
                              setIsOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-300 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-bold">Delete Item?</AlertDialogTitle>
                                <AlertDialogDescription>Permanently remove <b>{item.title}</b> from the database.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="rounded-full bg-red-600">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Modern Compact Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-t-[32px] border-none shadow-2xl">
          <div className="mx-auto w-full max-w-2xl px-6 py-10 md:px-12 overflow-y-auto max-h-[90vh]">
            <header className="flex justify-between items-center mb-8">
              <DrawerTitle className="text-4xl font-black italic tracking-tighter">
                {selectedProduct ? "Edit." : "New."}
              </DrawerTitle>
              <DrawerClose className="h-10 w-10 flex items-center justify-center bg-zinc-50 rounded-full hover:rotate-90 transition-transform">
                <X className="w-4 h-4" />
              </DrawerClose>
            </header>

            <div className="space-y-8">
              {/* Image Section */}
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-32 shrink-0 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-100 transition-colors border-dashed border-2"
                >
                  {formData.image ? <img src={formData.image} className="h-full w-full object-cover" /> : <ImageIcon className="text-zinc-300" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Product Media</h4>
                  <p className="text-xs text-zinc-400">Upload a high-quality preview of your product.</p>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2 h-8 rounded-lg text-[10px] font-black uppercase">Change Image</Button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><AlignLeft className="w-3 h-3"/> Product Title</Label>
                  <Input className="h-12 bg-zinc-50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-900" 
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><Euro className="w-3 h-3"/> Price</Label>
                  <Input type="number" className="h-12 bg-zinc-50 border-none rounded-xl font-mono text-lg font-bold"
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400">Description</Label>
                <textarea 
                  className="w-full h-24 p-4 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-zinc-900 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Dynamic Specs */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-zinc-50 pb-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-900 flex items-center gap-1"><Hash className="w-3 h-3"/> Technical Specs</Label>
                    <Button onClick={() => setFormData(prev => ({ ...prev, specs: [...prev.specs, { label: "", value: "" }] }))} 
                      variant="ghost" size="sm" className="h-8 rounded-full font-bold text-xs">+ Add</Button>
                 </div>
                 <div className="grid gap-2">
                    {formData.specs.map((spec, i) => (
                      <div key={i} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                        <Input placeholder="Label" className="h-10 bg-zinc-50 border-none rounded-lg text-xs font-bold" 
                          value={spec.label} onChange={(e) => {
                            const n = [...formData.specs]; n[i].label = e.target.value; setFormData({...formData, specs: n})
                          }} />
                        <Input placeholder="Value" className="h-10 bg-zinc-50 border-none rounded-lg text-xs" 
                          value={spec.value} onChange={(e) => {
                            const n = [...formData.specs]; n[i].value = e.target.value; setFormData({...formData, specs: n})
                          }} />
                        <Button variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }))}>
                          <X className="h-4 w-4 text-zinc-300" />
                        </Button>
                      </div>
                    ))}
                 </div>
              </div>

              <Button onClick={handleSave} disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-black font-bold shadow-2xl">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}