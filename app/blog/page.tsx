import React from 'react';
import { ArrowRight } from "lucide-react";
import Link from 'next/link';

const BlogPage = ({ user = { accountType: 'INDIVIDUAL' } }) => {
  const isCompany = user.accountType === 'COMPANY';

  const posts = [
    { 
      id: "1", // blogid as 1
      title: "L'art du packaging éco-responsable", 
      etat: "new", 
      date: "MAR 2026",
      image: "/images/blog1.png"
    },
    { 
      id: "2", // blogid as 2
      title: "Logistique : Le secret des leaders", 
      etat: "used", 
      date: "FEB 2026",
      image: "/images/blog2.jpg"
    },
    { 
      id: "3", // blogid as 3
      title: "Design minimaliste, impact maximal", 
      etat: "used", 
      date: "JAN 2026",
      image: "/images/blog3.jpg"
    },
  ];

  return (
    <main className="min-h-screen bg-[#FBFBFB] selection:bg-[#A3E635]">
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <header className="px-6 pt-32 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-[#A3E635]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                {isCompany ? "Insights Professionnels" : "Journal de Marque"}
              </span>
            </div>
            <h1 className="text-[12vw] md:text-[8rem] font-[1000] leading-[0.8] tracking-[-0.05em] uppercase italic">
              Blog<span className="text-[#A3E635] not-italic ml-2">.</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="px-6 max-w-7xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-32 gap-x-12">
          {posts.map((post, index) => (
            <Link 
              href={`/blog/${post.id}`} 
              key={post.id}
              className={`group relative flex flex-col no-underline ${
                index % 3 === 0 ? "md:col-span-8" : "md:col-span-4"
              }`}
            >
              {/* STYLIZED INDEX INDICATOR (.1, .2, .3) */}
              <div className="absolute -top-12 -left-4 z-0 pointer-events-none">
                <span className="text-[10rem] font-black text-black/[0.03] leading-none select-none group-hover:text-[#A3E635]/10 transition-colors duration-700">
                  .{post.id}
                </span>
              </div>

              {/* Image Container */}
              <div className="relative z-10 w-full aspect-[16/10] overflow-hidden bg-black shadow-2xl">
                <div className="absolute top-6 left-6 z-20">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    post.etat === 'new' 
                    ? "bg-[#A3E635] text-black" 
                    : "bg-white text-black italic border border-black/10"
                  }`}>
                    {post.etat === 'new' ? 'Nouveau' : 'Archive'}
                  </span>
                </div>

                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Text Meta */}
              <div className="mt-8 relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
                  <span>{post.date}</span>
                  {/* Small Inline Indicator */}
                  <span className="group-hover:text-[#A3E635] transition-colors font-black uppercase tracking-widest italic">
                    Case Study No.{post.id}
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] group-hover:translate-x-4 transition-transform duration-500 max-w-2xl">
                  {post.title}
                </h2>

                <div className="flex items-center gap-4 mt-2">
                   <div className="h-[1px] flex-1 bg-black/10 group-hover:bg-[#A3E635] transition-colors" />
                   <div className="bg-[#A3E635] p-3 rounded-full opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                     <ArrowRight size={20} className="text-black" />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      
    </main>
  );
};

export default BlogPage;