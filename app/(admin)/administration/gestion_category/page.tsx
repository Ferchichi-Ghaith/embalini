"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Loader2, 
  X, Image as ImageIcon, Tag
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
import { useEdgeStore } from "@/lib/edge"

const CAT_API_URL = "/api/v1/category"

export default function CategoryAdminPage() {
  const { edgestore } = useEdgeStore()
  
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    image: "" 
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch(CAT_API_URL)
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { 
    fetchCategories() 
    // Cleanup blob URLs on unmount
    return () => {
        if (formData.image.startsWith('blob:')) URL.revokeObjectURL(formData.image)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Memory cleanup for previous preview
      if (formData.image.startsWith('blob:')) URL.revokeObjectURL(formData.image)
      
      setFile(selectedFile)
      setFormData(prev => ({ 
        ...prev, 
        image: URL.createObjectURL(selectedFile) 
      }))
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.image) return alert("Title and Image are required")
    
    setIsSubmitting(true)
    try {
      let finalImageUrl = formData.image

      // 1. EdgeStore Upload (New Instance for Update/Create)
      if (file) {
        const res = await edgestore.Emablini.upload({
          file,
          onProgressChange: (progress) => setUploadProgress(progress),
          options: {
            // Automatically purges the old image from cloud if updating
            replaceTargetUrl: selectedCategory?.image || undefined,
          }
        })
        finalImageUrl = res.url
      }

      const method = selectedCategory ? "PATCH" : "POST"
      const url = selectedCategory ? `${CAT_API_URL}/${selectedCategory.id}` : CAT_API_URL
      
      // 2. Database Sync
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          image: finalImageUrl
        })
      })

      if (response.ok) { 
        setIsOpen(false)
        setFile(null)
        setUploadProgress(0)
        fetchCategories() 
      }
    } catch (error) { 
      console.error("Critical Save Error:", error) 
    } finally { 
      setIsSubmitting(false) 
    }
  }

  const handleDelete = async (category: any) => {
    // Optimistic UI Removal
    setCategories(prev => prev.filter(c => c.id !== category.id))
    
    try { 
      // Delete from DB
      const res = await fetch(`${CAT_API_URL}/${category.id}`, { method: "DELETE" }) 
      
      // Delete from Cloud Storage
      if (res.ok && category.image) {
        await edgestore.Emablini.delete({
            url: category.image,
        })
      }
    } catch (e) { 
        console.error("Delete failed", e)
        fetchCategories() 
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased">
      <main className="max-w-[1000px] mx-auto p-4 md:p-10 space-y-6">
        
        <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Categories.</h1>
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Classification System</p>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedCategory(null)
              setFile(null)
              setUploadProgress(0)
              setFormData({ title: "", image: "" })
              setIsOpen(true)
            }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 h-12 shadow-xl transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </header>

        <div className="rounded-xl border border-zinc-100 shadow-2xl shadow-zinc-100/50 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] pl-6 py-4 text-[10px] font-black uppercase text-zinc-500">Icon</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Category Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">ID Reference</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase text-zinc-500">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" /></TableCell></TableRow>
                  ) : categories.map((cat) => (
                    <motion.tr 
                      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={cat.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
                          <img src={cat.image || "/placeholder.png"} className="h-full w-full object-cover" alt={cat.title} />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-sm tracking-tight text-zinc-800 uppercase italic">
                        {cat.title}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-zinc-400">
                        {cat.id}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white shadow-sm"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setFile(null);
                              setUploadProgress(0);
                              setFormData({ title: cat.title, image: cat.image });
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
                            <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-black italic text-2xl tracking-tighter">DELETE CATEGORY?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove <b>{cat.title}</b>. Warning: Products linked to this category may break.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full border-zinc-100">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(cat)} className="rounded-full bg-red-600 hover:bg-red-700">Confirm</AlertDialogAction>
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
        <DrawerContent className="rounded-t-[32px] border-none shadow-2xl">
          <div className="mx-auto w-full max-w-lg px-6 py-10 overflow-y-auto">
            <header className="flex justify-between items-center mb-10">
              <DrawerTitle className="text-4xl font-black italic tracking-tighter">
                {selectedCategory ? "Modify." : "Define."}
              </DrawerTitle>
              <DrawerClose className="h-10 w-10 flex items-center justify-center bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors">
                <X className="w-4 h-4" />
              </DrawerClose>
            </header>

            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-40 w-full rounded-3xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-100 transition-all group"
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} className="h-full w-full object-cover" alt="Preview" />
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white font-black">
                          {Math.round(uploadProgress)}%
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <ImageIcon className="mx-auto text-zinc-300 w-8 h-8 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black uppercase text-zinc-400">Upload Banner</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1">
                  <Tag className="w-3 h-3"/> Category Label
                </Label>
                <Input 
                  placeholder="e.g. SMARTPHONES"
                  className="h-14 bg-zinc-50 border-none rounded-2xl font-bold text-lg uppercase italic focus-visible:ring-1 focus-visible:ring-zinc-900" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSubmitting} 
                className="w-full h-16 rounded-2xl bg-zinc-900 text-white hover:bg-black font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin h-5 w-5 mb-1" />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <span className="text-[8px] normal-case italic font-bold">Uploading {Math.round(uploadProgress)}%</span>
                    )}
                  </div>
                ) : "Save Category"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}