"use client";

import { useEffect, useState } from 'react';
import EmbaliniHero from '@/components/elements/blocks/Hero';
import CategorySection from '@/components/elements/blocks/Category';
import { ProcessSection } from '@/components/elements/blocks/procces';

// Définition de l'interface basée sur votre API
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  etat: string; // Utilisation de votre champ "etat"
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/produit/');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <EmbaliniHero />
      <CategorySection/>
      <ProcessSection/>
      
    </main>
  );
};

export default Page;