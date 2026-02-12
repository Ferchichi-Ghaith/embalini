"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot,
 // Added to allow letters and numbers
} from "@/components/ui/input-otp";
import { Loader2, RefreshCw, Fingerprint } from "lucide-react";
import { verifyAdminCode } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AdminAuthForm() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.setProperty("--x", `${x * 12}deg`);
    cardRef.current.style.setProperty("--y", `${-y * 12}deg`);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError(false);

    try {
      const result = await verifyAdminCode(otp);
      if (result.success) {
        router.refresh();
      } else {
        setError(true);
        setOtp(""); 
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="perspective-1000 flex min-h-screen items-center justify-center px-4 py-10 md:py-20">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (cardRef.current) {
            cardRef.current.style.setProperty("--x", "0deg");
            cardRef.current.style.setProperty("--y", "0deg");
          }
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          transform: "rotateX(var(--y, 0deg)) rotateY(var(--x, 0deg))", 
          transformStyle: "preserve-3d" 
        }}
        className="relative w-full max-w-md transition-transform duration-300 ease-out"
      >
        <div className="absolute -inset-1 rounded-[2rem] md:rounded-[3rem] bg-[#A3E635] opacity-20 blur-2xl md:blur-3xl" />
        
        <div className={cn(
          "relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-black/85 backdrop-blur-2xl shadow-2xl transition-all duration-700",
          error ? "border-destructive/50 shadow-destructive/10" : "border-white/10"
        )}>
          
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 z-50 h-[3px] w-full bg-[#A3E635] shadow-[0_0_20px_#A3E635]"
              />
            )}
          </AnimatePresence>

          <div className="p-6 md:p-10">
            <header className="mb-8 md:mb-10 flex flex-col items-center text-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mb-4 md:mb-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center "
              >
                <Fingerprint className="absolute h-full w-full scale-150 text-[#A3E635]" />
              </motion.div>
              
              <h1 className="text-xl sm:text-2xl md:text-4xl font-[1000] tracking-tighter uppercase italic text-white leading-tight">
                Portail Embalini<span className="text-[#A3E635]">.</span>
              </h1>
            </header>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-between px-1">
                <span className={cn(
                  "text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]",
                  error ? "text-destructive" : "text-[#A3E635]"
                )}>
                  {error ? "Séquence Erronée" : "Code de Sécurité"}
                </span>
                <button 
                  onClick={() => { setOtp(""); setError(false); }}
                  className="group flex items-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
                >
                  <RefreshCw className="mr-2 h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                  Reset
                </button>
              </div>

              <div className="flex justify-center">
                <InputOTP 
                 inputMode="text"          // ✅ force full keyboard
                 pattern=".*"              // ✅ allow any character
                  maxLength={6} 
                  value={otp}
                  onChange={(val) => {
                    setOtp(val.toUpperCase()); // Auto-capitalize for cleaner UX
                    if (error) setError(false);
                  }}
                  onComplete={handleVerify}
                  disabled={isLoading}
                
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot 
                      
                        key={index} 
                        index={index} 
                        className={cn(
                          "h-12 w-9 sm:h-16 sm:w-12 rounded-lg sm:rounded-xl border-white/10 bg-white/5 text-xl sm:text-2xl font-black text-white transition-all duration-300",
                          "focus-within:ring-2 focus-within:ring-[#A3E635] focus-within:border-transparent",
                          error && "border-destructive text-destructive animate-[bounce_0.5s_ease-in-out_infinite]"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerify} 
                disabled={otp.length < 6 || isLoading}
                className={cn(
                  "group relative w-full overflow-hidden rounded-xl py-6 md:py-8 text-xs md:text-sm font-[1000] uppercase tracking-[0.2em] transition-all",
                  "bg-[#A3E635] text-black hover:bg-[#b4f04d] hover:scale-[1.01] active:scale-[0.98]",
                  "disabled:opacity-20 disabled:grayscale"
                )}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Entrée Système ↵</>
                  )}
                </span>
                
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}