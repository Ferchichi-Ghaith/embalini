"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageSquare } from "lucide-react";

interface CTAProps {
  userAccountType?: "COMPANY" | "INDIVIDUAL";
}

const TESTIMONIALS = [
  {
    quote: "Nous tenions à vous remercier pour la qualité de vos sacs en carton. Votre travail répond parfaitement à nos attentes.",
    name: "LINEN COLOR",
    designation: "Eco-luxe pour la maison et les accessoires",
    src: "https://scontent.ftun20-1.fna.fbcdn.net/v/t39.30808-6/378317434_7416568875024294_5434878253437673382_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=XSmzMaoC5EcQ7kNvwHRBvIj&_nc_oc=AdliRDCwI0lvorQVpBkP4yYVFZVTHrsqrFt_WaSqlCtIweMTXaI7XXWO0zzt57Bwk9EHCwgIOn6MIT3yVn2CnV2a&_nc_zt=23&_nc_ht=scontent.ftun20-1.fna&_nc_gid=8_TztYoTPpEv0Nop2Z9sLA&oh=00_AfttE9q5K015mkjfx_nbeU02hWgZEg5t6oZL6ESXop1Uwg&oe=699249AC",
  },
  {
    quote: "Merci Embalini pour l'emballage écologique et personnalisé je commande chaleureusement leur solution bonne continuation.",
    name: "Faten Oueslati",
    designation: "Création digitale",
    src: "https://scontent.ftun20-1.fna.fbcdn.net/v/t39.30808-1/318330033_6494092897274697_7760795668453072097_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_ohc=RfxMcYdeNpgQ7kNvwEcxM73&_nc_oc=Adkxv-IvrgFBwoUGlkeHcLqItCLwscugsFpXc1DjD2ie-fQ8HPDH0KPURFQevZDGecNaETqAXseFiL1urN6mr9PW&_nc_zt=24&_nc_ht=scontent.ftun20-1.fna&_nc_gid=oBaILdM0p-eGI62Y_byIrA&oh=00_AfvALVeqWA_5G9R8cXaEeYwFrRSyPXX8gHTvC2-Qn-VM-w&oe=69923E28",
  },
  {
    quote: "Une excellente solution d'emballage, merci pour cette initiative écologique 🫶🏼 bonne continuation ❤️",
    name: "Soulaïma Omrani",
    designation: "Afawih Epicerie CEO/Co-Founder",
    src: "https://scontent-pmo1-1.xx.fbcdn.net/v/t39.30808-6/506295625_24485317337771432_6182384594260088899_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=6HyYYsuK-sQQ7kNvwHTewiE&_nc_oc=Adldm4VeWSAB1w3LnltEeHVbCf0duuDEq8MXJHNuUgqxvBzfN7FAWLkcEoSpqLCxaoc&_nc_zt=23&_nc_ht=scontent-pmo1-1.xx&_nc_gid=skZzNlfCqP5e5qThp3dsxw&oh=00_AftVZkl9zq8cl_6o-K3PHhOq78dcTTQ9tyU3lANiWWdPtw&oe=69923A5E",
  },
];

const FEATURES = [
  "Livraison Rapide ",
  "Matériaux Éco-responsables",
  "Solutions Personnalisées",
];


export function CTA({ userAccountType = "INDIVIDUAL" }: CTAProps) {
  const isCompany = userAccountType === "INDIVIDUAL";

  // Personnalisation du texte selon le type de compte
  const content = {
    title: isCompany ? "VALORISEZ" : "DONNEZ DE LA",
    highlight: isCompany ? "VOTRE MARQUE" : "VALEUR",
    description: isCompany 
      ? "Solutions B2B sur-mesure pour vos packagings industriels et commerciaux. Optimisez vos coûts et votre image."
      : "Expertise en emballage sur-mesure pour booster votre image de marque et sécuriser vos expéditions.",
    cta: isCompany ? "Demander un devis" : "Commencer mon projet"
  };

  return (
    <section className="relative py-10 px-6 overflow-hidden bg-background">
      {/* Background Image Container */}
   

      <div className="container mx-auto max-w-7xl relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8"
          >
         
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-foreground">
                {content.title} <br />
                <span className="italic underline decoration-primary/30 text-[#A3E635] underline-offset-8">
                  {content.highlight}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                {content.description}
              </p>
            </div>

          

            {/* CTA Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/25">
                {content.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
              
            
            </div>
          </motion.div>

          {/* Right Side: Testimonials */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[3rem]  -z-10 hidden sm:block" />
            <div className="relative">
               <AnimatedTestimonials testimonials={TESTIMONIALS} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}