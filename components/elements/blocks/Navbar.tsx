"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, ShoppingCart, Trash2, Search, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const navigationItems = [
  { name: "Accueil", href: "/" },
  { name: "Produits", href: "/products" },
  { name: "Expertise", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const { scrollY } = useScroll();

  const updateCart = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("productpanierlist");
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  };

  const removeItem = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    localStorage.setItem("productpanierlist", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("cartUpdate", updateCart);
    window.addEventListener("storage", updateCart);
    return () => {
      window.removeEventListener("cartUpdate", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 border-b",
      isScrolled ? "h-14 bg-[#A3E635] text-white backdrop-blur-xl border-black/5" : "h-20 bg-transparent border-transparent"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        
        {/* LOGO */}
        <Link href="/" className="z-50 group">
          <h1 className="text-2xl md:text-3xl font-[1000] tracking-tighter uppercase italic transition-transform group-hover:scale-105">
            Embalini<span className={cn("text-[#A3E635] ml-1", isScrolled ? "text-white" : "")}>.</span>
          </h1>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <TextRoll className="text-[11px] font-bold uppercase tracking-[0.2em]">
                {item.name}
              </TextRoll>
            </Link>
          ))}
          
        </nav>

        <div className="flex items-center gap-4">
          
          {/* DRAWER DU PANIER */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white">
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-black uppercase italic text-black">Votre Panier</DrawerTitle>
                  <DrawerDescription>Vous avez {cartItems.length} article(s) dans votre sélection.</DrawerDescription>
                </DrawerHeader>
                
                <div className="p-4 max-h-[40vh] overflow-y-auto">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-4 group">
                          <div className="h-16 w-16 rounded-xl bg-[#F4F4F4] overflow-hidden flex-shrink-0 border border-black/5">
                            <img 
                              src={item.productimage || "/placeholder.png"} 
                              alt={item.titre}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold uppercase text-sm leading-tight text-black">{item.titre}</p>
                            <p className="text-xs text-gray-500">Qté: {item.quantite}</p>
                            <p className="font-black text-xs mt-1 text-black">{item.prix_total} TND</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(index)}
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-5 space-y-2">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                        <ShoppingCart size={40} />
                      </div>
                      <p className="text-gray-400 font-medium italic">Le panier est vide</p>
                    </div>
                  )}
                </div>

                <DrawerFooter className="gap-2 pt-6 border-t">
                  <Button 
                    disabled={cartItems.length === 0}
                    onClick={() => {
                      if (cartItems.length === 0) return;
                      // Encodage base64 pour passer les données (optionnel selon votre logique /validecommand)
                      // const cartData = btoa(JSON.stringify(cartItems));
                      window.location.href = `/validecommand`;
                    }}
                    className={cn(
                      "w-full font-black uppercase tracking-widest transition-all py-7 rounded-2xl",
                      cartItems.length > 0 
                        ? "bg-[#A3E635] text-black hover:bg-black hover:text-[#A3E635] cursor-pointer" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                    )}
                  >
                    {cartItems.length > 0 ? "Valider la commande" : "Panier Vide"}
                  </Button>
                  
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <DrawerClose asChild>
                      <Link href="/products" className="w-full">
                        <Button 
                          variant="ghost" 
                          className="w-full text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                        >
                          Continuer mes achats
                        </Button>
                      </Link>
                    </DrawerClose>

                    <Link href="/check-command" className="w-full">
                      <Button 
                        variant="outline" 
                        className="w-full border-dashed border-black/20 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-50 transition-all py-5 rounded-xl flex gap-2"
                      >
                        <ClipboardList size={14} />
                        Suivre ma commande
                      </Button>
                    </Link>
                  </div>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? "text-white" : "text-black")}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-black text-white border-none flex flex-col items-center justify-center">
                <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
                <ul className="space-y-8 text-center flex flex-col items-center">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <SheetClose asChild>
                        <Link href={item.href} className="text-4xl font-black text-white uppercase italic hover:text-[#A3E635] transition-colors">
                          {item.name}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}

                  {/* BOUTON SUIVI COMMANDE MOBILE */}
                  <li className=" w-full px-10">
                    <SheetClose asChild>
                      <Link href="/check-command">
                        <Button variant="outline" className="w-full bg-[#A3E635] cursor-pointer text-black font-black uppercase italic py-7 rounded-2xl  flex gap-3">
                          <Search size={20} />
                          Suivre ma commande
                        </Button>
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// COMPOSANT TEXTROLL
const TextRoll = ({ children, className }: { children: string; className?: string }) => {
  return (
    <motion.span initial="initial" whileHover="hovered" className={cn("relative block overflow-hidden", className)} aria-label={children}>
      <div className="block" aria-hidden="true">
        {children.split("").map((l, i) => (
          <motion.span key={i} variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: [0.6, 0.01, 0.05, 0.95], delay: i * 0.02 }} className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 block" aria-hidden="true">
        {children.split("").map((l, i) => (
          <motion.span key={i} variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: [0.6, 0.01, 0.05, 0.95], delay: i * 0.02 }} className="inline-block"
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};