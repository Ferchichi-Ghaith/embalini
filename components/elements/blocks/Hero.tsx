
import { ArrowRight,  } from "lucide-react";



const EmbaliniHero = () => {


  return (
    <section 
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden  selection:bg-[#A3E635] selection:text-black"
    >
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#FBFBFB]/80 via-transparent to-[#FBFBFB] z-10" />
        <img 
          src="https://img.freepik.com/free-vector/vector-abstract-green-background-template_474888-2577.jpg" 
          alt="Embalini Premium Packaging"
          className="w-full h-full object-cover  "
        />
      </div>

      {/* Grain Texture */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div 
        
        
        className="relative z-30 flex flex-col items-center px-6 text-center max-w-7xl"
      >
        
        {/* Business Badge */}
        <div  className="mb-6 group mt-2">
          <div className="px-5 py-2 rounded-full border border-black/5 bg-white/40 backdrop-blur-xl shadow-sm flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3E635]"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/60 flex items-center gap-2">
              Standard de Qualité 2026
            </span>
          </div>
        </div>

        {/* Headline Section */}
        <div className="relative">
          <h1 
           
            className="text-[15vw] md:text-[11rem] font-[1000] leading-[0.75] tracking-[-0.07em] uppercase text-black italic drop-shadow-sm"
          >
            Embalini<span className="text-[#A3E635] not-italic">.</span>
          </h1>
          
          <div className="mt-8 overflow-hidden">
            <h2 className="text-[5vw] md:text-[3rem] font-light tracking-tighter text-black/60 uppercase italic">
              L'excellence par la <span className="font-bold text-black not-italic relative inline-block">
                Protection
                <span 
                   
                  
               
                   className="absolute -bottom-2 left-0 h-[3px] bg-[#A3E635]"
                />
              </span>
            </h2>
          </div>
        </div>

        <p 
          className="mt-12 max-w-2xl text-lg md:text-xl text-black/70 font-medium leading-relaxed drop-shadow-sm"
        >
          Transformez votre logistique en une signature de marque prestigieuse. 
          Le futur de l'emballage est arrivé.
        </p>

        <div  className="mt-12 flex flex-col sm:flex-row gap-6">
            <button className="px-10 py-5 bg-black text-[#A3E635] rounded-full font-bold uppercase text-[11px] tracking-widest flex items-center gap-4 hover:scale-105 transition-transform">
                Démarrer un Projet <ArrowRight size={18} />
            </button>
        </div>
      </div>

   
    </section>
  );
};

export default EmbaliniHero;