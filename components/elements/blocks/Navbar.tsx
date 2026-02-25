"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, ShoppingCart, Trash2, Search } from "lucide-react";
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
      "fixed top-0 z-50 w-full transition-all duration-300 border-b ",
      isScrolled ? "h-12 bg-[#F9FAFB] text-black shadow-sm border-gray-200" : "h-12 border-transparent bg-[#F9FAFB]"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        
        {/* LOGO */}
        <Link href="/" className="z-50 group flex items-center">
          <img 
            src="/images/logo.svg" 
            alt="Embalini Logo" 
            className="w-32 h-auto object-contain" 
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-10">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <TextRoll className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                {item.name}
              </TextRoll>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-black">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white h-[85vh] md:h-[70vh]"> {/* Fixed height to ensure layout works */}
              <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
                
                {/* HEADER - Fixed */}
                <DrawerHeader className="flex-shrink-0">
                  <DrawerTitle className="text-2xl font-black uppercase italic text-black">Votre Panier</DrawerTitle>
                  <DrawerDescription>Vous avez {cartItems.length} article(s) dans votre sélection.</DrawerDescription>
                </DrawerHeader>
                
                {/* ITEMS LIST - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 border-b pb-4">
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
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                      <ShoppingCart size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-medium italic">Le panier est vide</p>
                    </div>
                  )}
                </div>

                {/* FOOTER - Fixed at the bottom */}
                <DrawerFooter className="flex-shrink-0 gap-2 border-t bg-white p-4">
                  <Button 
                    disabled={cartItems.length === 0}
                    onClick={() => {
                      if (cartItems.length === 0) return;
                      window.location.href = `/validecommand`;
                    }}
                    className={cn(
                      "w-full font-black uppercase tracking-widest py-6 rounded-2xl",
                      cartItems.length > 0 
                        ? "bg-black text-white hover:bg-gray-800" 
                        : "bg-gray-100 text-gray-400 opacity-70"
                    )}
                  >
                    {cartItems.length > 0 ? "Valider la commande" : "Panier Vide"}
                  </Button>
                  
                  {/* Follow Order Button - Always Visible here on Desktop/Panier */}
                  <Link href="/check-command" className="w-full">
                    <Button variant="outline" className="w-full border-black text-black font-black uppercase italic py-6 rounded-2xl flex gap-3 hover:bg-gray-50 transition-all">
                      <Search size={18} />
                      Suivre ma commande
                    </Button>
                  </Link>
                  
                  <DrawerClose asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100 transition-opacity text-black h-auto py-2"
                    >
                      Continuer mes achats
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-black">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-white flex flex-col items-center justify-center p-0">
                <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
                <ul className="space-y-8 text-center flex flex-col items-center w-full">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <SheetClose asChild>
                        <Link href={item.href} className="text-4xl font-black text-black uppercase italic hover:text-gray-500 transition-colors">
                          {item.name}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  
                  {/* Fixed Button for Mobile Menu */}
                  <li className="w-full px-10 pt-4">
                    <SheetClose asChild>
                      <Link href="/check-command" className="w-full">
                        <Button variant="outline" className="w-full bg-black text-white font-black uppercase italic py-7 rounded-2xl flex gap-3 justify-center">
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