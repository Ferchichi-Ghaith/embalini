"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Tag } from "lucide-react";
import Link from "next/link";

interface ProductProps {
  id: string;
  title: string;
  price: string;
  image: string;
  badge?: string;    // Maps to 'etat'
  category?: string; // Maps to 'category.title'
}

const ProductCard = ({ id, title, price, image, badge, category }: ProductProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[2rem] bg-[#F3F3F3]">
        
        {/* CONDITION BADGE (ETAT) - Minimalist Glassmorphism */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <div className="backdrop-blur-md bg-white/70 border border-white/20 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-[8px] font-black uppercase tracking-widest text-black">
                {badge}
              </span>
            </div>
          </div>
        )}

        {/* Product Image */}
        <motion.img
          src={image || "/placeholder.png"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

        {/* "View Details" CTA */}
        <motion.div 
          className="absolute bottom-4 left-4 right-4 transition-all duration-500 
          opacity-100 translate-y-0 
          sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
        >
          <Link 
            href={`/products/${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#94C973] shadow-2xl active:scale-[0.98] transition-transform"
          >
            Explorer <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-5 flex items-start justify-between px-1">
        <div className="flex-1 pr-4">
          {/* Taxonomy / Category */}
          {category && (
            <div className="flex items-center gap-1.5 mb-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <Tag size={8} className="text-black" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-black">
                {category}
              </span>
            </div>
          )}
          
          <h3 className="text-sm font-black uppercase tracking-tight text-black leading-tight">
            {title}
          </h3>
          
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.15em] text-black/20">
            System. v2026
          </p>
        </div>
        
        <div className="text-right">
          <span className="text-sm font-black italic text-black tabular-nums">
            {price}
          </span>
          <p className="text-[7px] font-bold uppercase text-black/30 mt-0.5">TND / UNIT</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;