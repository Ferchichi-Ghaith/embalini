import React from 'react';
import { Quote } from 'lucide-react';

const CSRQuoteSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 px-6">
      {/* Subtle Background Element */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Icon Header */}
          <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200/50">
            <Quote className="w-6 h-6 text-white fill-white" />
          </div>

          {/* Quote Content */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.3] text-slate-800 tracking-tight">
              “Adoptez un <span className="text-emerald-600 font-semibold italic">packaging éco-responsable</span> et renforcez votre stratégie <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold">RSE</span> grâce à nos solutions d’emballage conçues pour réduire l’impact environnemental tout en valorisant votre image de marque.”
            </h2>
          </div>

          {/* Decorative Bottom Line */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-emerald-200" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-emerald-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSRQuoteSection;