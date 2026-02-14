"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/elements/utils/productcard";

// Define the interface based on your API structure
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  description?: string;
}

const ShowcasePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  // 1. Fetching data from your API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/v1/produit/");
        const data = await response.json();
        
        // Ensure the data mapping matches your ProductCard props
        // If your API returns different keys, map them here
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p className="animate-pulse font-black uppercase tracking-tighter">Chargement...</p>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden selection:bg-[#A3E635] selection:text-black">
      
      {/* KINETIC BACKGROUND TYPOGRAPHY */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.09]">
        <h2 className="text-[20vw] font-black italic uppercase tracking-tighter leading-none select-none">
          EMBALINI
        </h2>
      </div>

      <section className="relative z-10 pt-40 pb-40 px-6 md:px-12 max-w-[1600px] mx-auto">
        
        {/* DYNAMIC HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/10 pb-6">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.75]">
              Notre Solutions <br /> <span className="text-[#A3E635]">d'Emballage.</span>
            </h1>
          </div>
        </div>

        {/* STAGGERED 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <ProductCard 
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ShowcasePage;