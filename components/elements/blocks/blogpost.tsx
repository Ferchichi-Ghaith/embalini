"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Définition de l'interface pour le typage (basé sur vos données API)
interface Post {
  id: string;
  title: string;
  etat: string; // Votre champ personnalisé
  date: string;
  readTime: string;
  image: string;
  content: string;
}

const BlogPostPage = () => {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Appel à votre API
        const response = await fetch(`/api/v1/blog/${params.id}`);
        
        if (!response.ok) throw new Error("Post introuvable");
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error("Erreur lors du fetch:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  // Gestion des états de chargement et d'erreur
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Chargement...</div>;
  if (error || !post) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Article introuvable.</div>;

  return (
    <main className="selection:bg-[#A3E635] selection:text-black overflow-x-hidden scroll-pt-24 mt-4">
      <div className="fixed inset-0 z-100 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <section className="relative pt-20 md:pt-24 min-h-screen md:h-[95vh] flex flex-col md:flex-row border-b border-black/5">
        
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-start p-6 sm:p-10 md:p-16 gap-8 order-2 md:order-1">
          {/* Badge d'état basé sur votre champ 'etat' */}
          <div className="flex gap-4 items-center">
            <span className="px-3 py-1 bg-black text-[#A3E635] text-xs font-bold uppercase tracking-widest">
              {post.etat}
            </span>
            <span className="text-sm font-bold opacity-50">{post.date}</span>
          </div>

          <h1 className="text-[10vw] md:text-[3.5rem] font-[1000] leading-[0.8] uppercase italic tracking-tighter">
            {post.title}
          </h1>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-full overflow-hidden order-1 md:order-2">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-contain" // "cover" est souvent plus esthétique pour les blogs
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-1">
        <div className="lg:col-span-8">
          <div className="prose prose-2xl prose-neutral max-w-none font-medium leading-relaxed">
            <p className="first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-[#A3E635]">
              {post.content}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPostPage;