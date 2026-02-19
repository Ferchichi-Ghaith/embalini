import { ArrowRight, ChevronDown, MousePointer2 } from "lucide-react";

interface Props {
  user?: { accountType: "COMPANY" | "INDIVIDUAL" };
}

const EmbaliniHero = ({ user }: Props) => {
  const isCompany = user?.accountType === "COMPANY";

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center  overflow-hidden selection:bg-[#94C973] selection:text-white">
      
      {/* BACKGROUND: Award-winning Texture & Depth */}
      <div className="absolute inset-0 z-0">
        {/* Soft Branding Gradient */}
        <div className="absolute inset-0  z-10" />
        <img 
          src="https://img.freepik.com/premium-photo/moving-boxes-plants-new-home-office_1410957-66012.jpg" 
          alt="Texture"
          className="w-full h-full object-cover opacity-90  mix-blend-multiply"
        />
        {/* Persistent Film Grain (Awwwards 2026 Staple) */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-30 flex flex-col items-center w-full max-w-[1440px] px-6">
       

        {/* Headline: Staggered Editorial Style */}
        <div className="text-center mb-16">
          <h1 className="flex flex-col items-center">
            <span className="text-[17vw] md:text-[13rem] font-extralight leading-[0.75] tracking-[-0.06em] text-[#0D2C30] uppercase">
              Emba<span className="font-serif italic text-[#94C973] lowercase">l</span>ini
            </span>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 opacity-80">
               <span className="text-xl md:text-4xl font-serif text-[#0D2C30] tracking-tighter uppercase">L'Art de la</span>
               <span className="text-xl md:text-4xl font-serif italic text-[#f5f5f5] tracking-tight">Protection</span>
               <span className="text-xl md:text-4xl font-serif text-[#0D2C30]  tracking-tighter uppercase">Prestigieuse</span>
            </div>
          </h1>
        </div>

        {/* Bento Interaction Group */}
        <div className="flex flex-col md:flex-row items-stretch gap-px bg-[#0D2C30]/10 border border-[#0D2C30]/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <button className="px-14 py-10 bg-[#0D2C30] text-white flex flex-col items-start gap-5 transition-all hover:bg-[#143d42] group min-w-[320px]">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                {isCompany ? "Solutions Pro" : "Clientèle Privée"}
             </span>
             <span className="text-2xl font-light flex items-center justify-between w-full">
                {isCompany ? "Devis Sur-Mesure" : "Explorer l'Eshop"}
                <ArrowRight className="group-hover:translate-x-3 transition-transform text-[#94C973]" />
             </span>
          </button>
          
          <button className="px-14 py-10 bg-white/60 text-[#0D2C30] flex flex-col items-start gap-5 transition-all hover:bg-white group min-w-[320px]">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Catalogue</span>
             <span className="text-2xl font-light flex items-center justify-between w-full">
                Saison 2026
                <MousePointer2 size={20} className="opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all text-[#94C973]" />
             </span>
          </button>
        </div>
      </div>

     

    </section>
  );
};

export default EmbaliniHero;