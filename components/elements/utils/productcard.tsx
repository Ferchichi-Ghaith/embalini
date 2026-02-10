"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  id: string;
  title: string;
  price: string;
  image: string;
  etat: string; // "Premium", "Édition Limitée", etc.
}

const ProductCard = ({ id, title, price, image, etat }: ProductProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative w-full"
    >
      {/* Container de l'image avec overflow-hidden pour l'effet de zoom */}
      <div className="relative aspect-6/5 w-full overflow-hidden rounded-3xl bg-[#F3F3F3]">
        
        {/* Badge d'état (API Data) */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-black shadow-sm border border-black/5">
            {etat}
          </span>
        </div>

        {/* Image avec animation de survol */}
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-110"
        />

        {/* Overlay au survol qui assombrit légèrement pour le texte */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />

        {/* Bouton "View Details" flottant qui apparaît au survol */}
        <motion.div 
          className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Link 
            href={`/products/${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A3E635] shadow-2xl"
          >
            Détails <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Infos Produit - Typographie minimaliste */}
      <div className="mt-6 flex items-start justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-black/80">
            {title}
          </h3>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-black/30">
            Collection 2026
          </p>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-black italic text-black">
            {price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;