"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

// Simulation de la donnée utilisateur de votre API
const userData = { accountType: "INDIVIDUAL" }; // ou "INDIVIDUAL"

const navigationItems = [
  { name: "Accueil", href: "/" },
  { name: "Produits", href: "/products" },
  { name: "Expertise", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
      isScrolled ? "h-14  bg-[#A3E635] text-white backdrop-blur-xl border-black/5" : "h-20 bg-transparent border-transparent"
    )}>
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        
        <Link href="/" className="z-50 group">
          <h1 className="text-2xl md:text-3xl font-[1000] tracking-tighter uppercase italic transition-transform group-hover:scale-105">
            Embalini<span className={cn("text-[#A3E635] ml-1",isScrolled ? "text-white" :"")}>.</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <TextRoll className="text-[11px] font-bold uppercase tracking-[0.2em] ">
                {item.name}
              </TextRoll>
            </Link>
          ))}
          
          <Button className="bg-black hover:bg-[#A3E635] hover:text-black text-white rounded-full px-8 py-5 transition-all duration-500 font-bold uppercase text-[10px] tracking-widest">
            {userData.accountType === "COMPANY" ? "Espace Pro" : "Rejoindre"}
          </Button>
        </nav>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-black border-none flex flex-col items-center justify-center">
              <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
              <ul className="space-y-8 text-center">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <SheetClose asChild>
                      <Link href={item.href} className="text-4xl font-black text-white uppercase italic hover:text-[#A3E635] transition-colors">
                        {item.name}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
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