"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";



const BlogPostPage = ({ }) => {
  // 1. On définit les données (on peut imaginer que l'id vient de params.id)
  const params = useParams();
  const posts = [
    { id: "1", title: "L'art du packaging éco-responsable", etat: "new", date: "MAR 2026", readTime: "6 min", image: "/images/blog1.png", content: "L'industrie de l'emballage traverse une révolution..." },
    { id: "2", title: "Logistique : Le secret des leaders", etat: "used", date: "FEB 2026", readTime: "8 min", image: "/images/blog2.jpg", content: "L'optimisation de la chaîne logistique..." },
    { id: "3", title: "Design minimaliste, impact maximal", etat: "used", date: "JAN 2026", readTime: "5 min", image: "/images/blog3.jpg", content: "Moins c'est mieux. Le design minimaliste..." }
  ];

  // 2. On récupère le post spécifique (ici on prend le premier pour l'exemple)
  const post = useMemo(() => {
    return posts.find((p) => p.id === params.id) || posts[0];
  }, [params.id]);
  return (
    <main className=" selection:bg-[#A3E635] selection:text-black overflow-x-hidden scroll-pt-24 mt-4">
      <div className="fixed inset-0 z-100 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <section className="relative pt-20 md:pt-24 min-h-screen md:h-[95vh] flex flex-col md:flex-row border-b border-black/5">
        
        {/* Left Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-start p-6 sm:p-10 md:p-16 gap-8 order-2 md:order-1">
       

          <h1 className="text-[10vw] md:text-[5.5rem] font-[1000] leading-[0.8] uppercase italic tracking-tighter">
            {post.title}
          </h1>

        
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-full overflow-hidden order-1 md:order-2 ">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl  px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-1">
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