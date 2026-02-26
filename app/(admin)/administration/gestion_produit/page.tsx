"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Loader2, 
  X, Hash, AlignLeft, Euro, Image as ImageIcon,
  Tag, Box, Info, ChevronDown
} from "lucide-react"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useEdgeStore } from "@/lib/edge"

const API_URL = "/api/v1/produit"
const CAT_API_URL = "/api/v1/category"

interface Spec {
  label: string;
  value: string;
}

export default function ProductAdminPage() {
  const { edgestore } = useEdgeStore()
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",  
    price: "", 
    image: "", 
    description: "",
    categoryId: "",
    etat: "NEW", 
    specs: [] as Spec[]
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([ fetch(API_URL), fetch(CAT_API_URL) ])
      const prodData = await prodRes.json()
      const catData = await catRes.json()
      setProducts(Array.isArray(prodData) ? prodData : [])
      setCategories(Array.isArray(catData) ? catData : [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { 
    fetchData() 
    return () => {
      // Cleanup preview URLs on unmount
      if (formData.image.startsWith('blob:')) URL.revokeObjectURL(formData.image)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (formData.image.startsWith('blob:')) URL.revokeObjectURL(formData.image)
      setFile(selectedFile)
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(selectedFile) }))
    }
  }

  const handleSave = async () => {
    if (!formData.categoryId) return alert("Please select a category")
    setIsSubmitting(true)
    
    try {
      let finalImageUrl = formData.image

      // 1. EdgeStore Logic (Fresh Instance for Create/Update)
      if (file) {
        const res = await edgestore.Emablini.upload({
          file,
          onProgressChange: (progress) => setUploadProgress(progress),
          options: {
            // Replace old cloud image if updating an existing product
            replaceTargetUrl: selectedProduct?.image || undefined,
          }
        })
        finalImageUrl = res.url
      }

      const method = selectedProduct ? "PATCH" : "POST"
      const url = selectedProduct ? `${API_URL}/${selectedProduct.id}` : API_URL
      
      // 2. Database Authorization
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          image: finalImageUrl,
          price: parseFloat(formData.price) 
        })
      })

      if (response.ok) { 
        setIsOpen(false)
        setFile(null)
        setUploadProgress(0)
        fetchData() 
      }
    } catch (error) { 
      console.error("Save failed:", error) 
    } finally { 
      setIsSubmitting(false) 
    }
  }

  const handleDelete = async (product: any) => {
    // Optimistic UI
    setProducts(prev => prev.filter(p => p.id !== product.id))
    
    try { 
      const res = await fetch(`${API_URL}/${product.id}`, { method: "DELETE" }) 
      
      // If DB delete is successful, purge from EdgeStore
      if (res.ok && product.image) {
        await edgestore.Emablini.delete({
          url: product.image,
        })
      }
    } catch (e) { 
      console.error("Deletion Error:", e)
      fetchData() 
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      <main className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-6">
        
        <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Inventory.</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Master Database • {products.length} Units</p>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedProduct(null)
              setFile(null)
              setUploadProgress(0)
              setFormData({ title: "", price: "", image: "", description: "", categoryId: "", etat: "NEW", specs: [] })
              setIsOpen(true)
            }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 h-12 shadow-xl transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Entry
          </Button>
        </header>

        <div className="rounded-2xl border border-zinc-100 shadow-2xl shadow-zinc-200/40 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] pl-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Preview</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Taxonomy</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Valuation</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="h-60 text-center"><Loader2 className="animate-spin mx-auto text-zinc-200" /></TableCell></TableRow>
                  ) : products.map((item) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                      <TableCell className="pl-6">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img src={item.image || "/placeholder.png"} className="h-full w-full object-cover" alt="" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-sm tracking-tight text-zinc-800">{item.title}</div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 max-w-[200px] italic">{item.description || "No description provided."}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit text-[9px] font-black bg-white uppercase border-zinc-200">
                            {item.category?.title || "UNCATEGORIZED"}
                          </Badge>
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{item.etat} CONDITION</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-black text-sm text-zinc-900">
                        {item.price?.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:shadow-md transition-all"
                            onClick={() => {
                              setSelectedProduct(item);
                              setFile(null);
                              setUploadProgress(0);
                              setFormData({ ...item, price: item.price.toString(), categoryId: item.categoryId || "", etat: item.etat || "NEW" });
                              setIsOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5 text-zinc-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-300 hover:text-red-600">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Delete Item?</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-500 font-medium">This record will be permanently purged from the master inventory and cloud storage.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-2">
                                <AlertDialogCancel className="rounded-full font-bold">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item)} className="rounded-full bg-red-600 font-bold">Purge Record</AlertDialogAction>
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

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-t-[40px] border-none shadow-2xl max-h-[95vh] outline-none">
          <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-12 overflow-y-auto outline-none">
            <header className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <DrawerTitle className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                  {selectedProduct ? "Update." : "Create."}
                </DrawerTitle>
                <p className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">Inventory Database Entry</p>
              </div>
              <DrawerClose className="h-12 w-12 flex items-center justify-center bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </DrawerClose>
            </header>

            <div className="space-y-8">
              <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[24px] border border-zinc-100/50">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-28 w-28 shrink-0 rounded-2xl bg-white border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-zinc-900 transition-all group"
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="h-full w-full object-cover" alt="" />
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-bold">
                          {Math.round(uploadProgress)}%
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center space-y-1">
                       <ImageIcon className="mx-auto text-zinc-300 group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase text-zinc-400">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-[10px] font-black uppercase text-zinc-900">Visual Identity</Label>
                  <p className="text-xs text-zinc-500 leading-tight">Image will be hosted on EdgeStore (Emablini bucket).</p>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2">
                    <Tag className="w-3 h-3"/> Category
                  </Label>
                  <div className="relative">
                    <select 
                      className="w-full h-14 bg-zinc-50 border-none rounded-2xl px-4 appearance-none font-bold text-sm focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer"
                      value={formData.categoryId} 
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    >
                      <option value="" disabled>Select Taxonomy</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2"><Box className="w-3 h-3"/> Condition</Label>
                  <Input 
                    className="h-14 bg-zinc-50 border-none rounded-2xl font-black uppercase focus:ring-2 focus:ring-zinc-900" 
                    value={formData.etat} 
                    onChange={(e) => setFormData({...formData, etat: e.target.value.toUpperCase()})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2"><AlignLeft className="w-3 h-3"/> Product Title</Label>
                  <Input 
                    className="h-14 bg-zinc-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-zinc-900" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2"><Euro className="w-3 h-3"/> Market Price (TND)</Label>
                  <Input 
                    type="number" 
                    className="h-14 bg-zinc-50 border-none rounded-2xl font-mono text-xl font-black focus:ring-2 focus:ring-zinc-900"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2"><Info className="w-3 h-3"/> Context / Description</Label>
                <textarea 
                  className="w-full h-28 p-5 bg-zinc-50 border-none rounded-[24px] text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the product features..."
                />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <Label className="text-[10px] font-black uppercase text-zinc-900 flex items-center gap-2"><Hash className="w-3 h-3"/> Technical Parameters</Label>
                    <Button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, specs: [...prev.specs, { label: "", value: "" }] }))} 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 rounded-full font-black text-[10px] uppercase hover:bg-zinc-900 hover:text-white transition-all"
                    >
                      + Add Param
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.specs.map((spec, i) => (
                      <div key={i} className="flex gap-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                        <Input 
                          placeholder="Key" 
                          className="h-9 bg-white border-none rounded-xl text-[10px] font-black uppercase" 
                          value={spec.label} 
                          onChange={(e) => {
                            const n = [...formData.specs]; n[i].label = e.target.value; setFormData({...formData, specs: n})
                          }} 
                        />
                        <Input 
                          placeholder="Value" 
                          className="h-9 bg-white border-none rounded-xl text-[10px] font-bold" 
                          value={spec.value} 
                          onChange={(e) => {
                            const n = [...formData.specs]; n[i].value = e.target.value; setFormData({...formData, specs: n})
                          }} 
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 shrink-0 hover:text-red-500" 
                          onClick={() => setFormData(prev => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                 </div>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSubmitting} 
                className="w-full h-20 rounded-[28px] bg-zinc-900 text-white hover:bg-black font-black uppercase italic tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] mb-10"
              >
                {isSubmitting ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin h-5 w-5 mb-1" />
                    <span className="text-[10px] normal-case font-bold italic">
                      {uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${Math.round(uploadProgress)}%` : "Saving Record..."}
                    </span>
                  </div>
                ) : "Authorize & Save"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}