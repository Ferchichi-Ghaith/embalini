
import Footer from "@/components/elements/blocks/Footer";
import { Navbar } from "@/components/elements/blocks/Navbar";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>

   <Navbar />
       
       {children}
     
    <Footer/>
    </>
  );
}
