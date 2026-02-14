"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Upload, Loader2, 
  X, Save, BookOpen, Calendar, Image as ImageIcon,
  FileText, Tag
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = "/api/v1/blog/"

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",  
    date: "", // ex: "MAR 2026"
    readTime: "",
    image: "",
    content: ""
  })

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { fetchPosts() }, [])

  const handleSave = async () => {
    setIsSubmitting(true)
    const method = selectedPost ? "PATCH" : "POST"
    const url = selectedPost ? `${API_URL}/${selectedPost.id}` : API_URL
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (response.ok) { setIsOpen(false); fetchPosts() }
    } catch (error) { console.error(error) } finally { setIsSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    try { await fetch(`${API_URL}/${id}`, { method: "DELETE" }) } catch (e) { fetchPosts() }
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
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Journal.</h1>
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Gestion du Contenu Editorial</p>
          </div>
          
          <Button 
            onClick={() => {
              setSelectedPost(null)
              setFormData({ title: "",  date: "FÉV 2026", readTime: "5 min", image: "", content: "" })
              setIsOpen(true)
            }}
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 h-12 shadow-xl transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvel Article
          </Button>
        </header>

        {/* Table de données */}
        <div className="rounded-xl border border-zinc-100 shadow-2xl shadow-zinc-100/50 overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] pl-6 py-4 text-[10px] font-black uppercase text-zinc-500">Aperçu</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Titre</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Lecture</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-zinc-500">Contenu</TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-black uppercase text-zinc-500">Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="h-60 text-center"><Loader2 className="animate-spin mx-auto text-zinc-300" /></TableCell></TableRow>
                  ) : posts.map((post) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={post.id} 
                      className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <TableCell className="pl-6">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                          <img src={post.image || "/placeholder.png"} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                        <span className="block font-bold text-sm tracking-tight text-zinc-800 w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
  {post.title}
</span>                         
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-zinc-600 uppercase">{post.date}</TableCell>
                      <TableCell className="text-xs font-mono text-zinc-500">{post.readTime}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-xs text-zinc-400 line-clamp-1 italic">
                          {post.content || "Aucun contenu"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setFormData({ ...post });
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
                                <AlertDialogTitle className="font-bold">Supprimer l'article ?</AlertDialogTitle>
                                <AlertDialogDescription>Cette action supprimera définitivement <b>{post.title}</b> de la base de données.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(post.id)} className="rounded-full bg-red-600">Supprimer</AlertDialogAction>
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

      {/* Drawer d'édition/création */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-t-[32px] border-none shadow-2xl">
          <div className="mx-auto w-full max-w-2xl px-6 py-10 md:px-12 overflow-y-auto max-h-[90vh]">
            <header className="flex justify-between items-center mb-8">
              <DrawerTitle className="text-4xl font-black italic tracking-tighter">
                {selectedPost ? "Éditer." : "Écrire."}
              </DrawerTitle>
              <DrawerClose className="h-10 w-10 flex items-center justify-center bg-zinc-50 rounded-full hover:rotate-90 transition-transform">
                <X className="w-4 h-4" />
              </DrawerClose>
            </header>

            <div className="space-y-8">
              {/* Image de couverture */}
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 w-32 shrink-0 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-100 transition-colors border-dashed border-2"
                >
                  {formData.image ? <img src={formData.image} className="h-full w-full object-cover" /> : <ImageIcon className="text-zinc-300" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Image de couverture</h4>
                  <p className="text-xs text-zinc-400">Format recommandé : 1200x800px.</p>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2 h-8 rounded-lg text-[10px] font-black uppercase">Changer l'image</Button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              </div>

              {/* Formulaire Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><FileText className="w-3 h-3"/> Titre de l'article</Label>
                  <Input className="h-12 bg-zinc-50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-900" 
                    placeholder="L'avenir de l'IA..."
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
              
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date d'affichage</Label>
                  <Input className="h-12 bg-zinc-50 border-none rounded-xl" 
                    placeholder="EX: FÉV 2026"
                    value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Temps de lecture</Label>
                  <Input className="h-12 bg-zinc-50 border-none rounded-xl" 
                    placeholder="EX: 5 min"
                    value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400">Contenu de l'article</Label>
                <textarea 
                  className="w-full h-48 p-4 bg-zinc-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-zinc-900 outline-none resize-none leading-relaxed"
                  placeholder="Écrivez votre contenu ici..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <Button onClick={handleSave} disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-zinc-900 text-white hover:bg-black font-bold shadow-2xl transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : (selectedPost ? "Mettre à jour" : "Publier l'article")}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}