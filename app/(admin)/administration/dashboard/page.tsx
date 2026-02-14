"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Globe, Box, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

const API_COMMANDS = "/api/v1/command"
const API_PRODUCTS = "/api/v1/produit"

export default function CompactDashboardHome() {
  const [stats, setStats] = useState({
    totalSales: 0,
    orderCount: 0,
    productCount: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cmdRes, prodRes] = await Promise.all([
          fetch(API_COMMANDS),
          fetch(API_PRODUCTS),
        ])

        const commands = await cmdRes.json()
        const products = await prodRes.json()

        setStats({
          totalSales: commands.reduce(
            (acc: number, curr: any) =>
              acc + Number(curr.total_estimation),
            0
          ),
          orderCount: commands.length,
          productCount: products.length,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  
    return (
      <div className="min-h-screen bg-white text-zinc-900 px-6 md:px-16 py-12 font-sans relative overflow-hidden">
    
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
    
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-medium">
            Performance Dashboard
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-4">
            EMBLINI<span className="text-emerald-500">.</span>
          </h1>
        </motion.header>
    
    
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
    
          {/* Orders */}
          <div className="md:col-span-3">
            <KpiCard
              icon={<Globe size={18} />}
              label="Total Orders"
              value={stats.orderCount}
              loading={loading}
            />
          </div>
    
          {/* Products */}
          <div className="md:col-span-3">
            <KpiCard
              icon={<Box size={18} />}
              label="Total Products"
              value={stats.productCount}
              loading={loading}
            />
          </div>
    
          {/* Revenue (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-6"
          >
            <Card className="h-full relative rounded-[3rem] border border-zinc-200 bg-gradient-to-br from-zinc-950 to-zinc-900 text-white p-8 md:p-10 overflow-hidden flex flex-col justify-center">
    
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Total Revenue
                </p>
    
                <h2 className="mt-6 text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                  {loading ? "—" : stats.totalSales.toLocaleString("fr-TN")}
                  <span className="text-xl md:text-2xl opacity-40 ml-3 not-italic">
                    TND
                  </span>
                </h2>
              </div>
    
              <Activity
                className="absolute -right-8 -bottom-8 opacity-[0.04]"
                size={200}
              />
            </Card>
          </motion.div>
    
        </div>
      </div>
    )
    
  
}


function KpiCard({
  icon,
  label,
  value,
  loading,
  highlight,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card
        className={`
        p-4 rounded-3xl border transition-all duration-300
        ${highlight
          ? "border-emerald-500/30 bg-emerald-50"
          : "border-zinc-200 bg-white"}
      `}
      >
        <div className="flex justify-between items-center text-zinc-400">
          <div
            className={`p-2 rounded-xl ${
              highlight ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-900"
            }`}
          >
            {icon}
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 mt-8 font-medium">
          {label}
        </p>

        <p className="text-3xl font-black tracking-tight mt-2">
          {loading ? "—" : value}
        </p>
      </Card>
    </motion.div>
  )
}
