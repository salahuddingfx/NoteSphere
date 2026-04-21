"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ContributionChart() {
  const [view, setView] = useState("daily");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get(`/users/stats?view=${view}`);
        setData(res.stats);
      } catch (err) {
        console.error("Failed to fetch contribution stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [view]);

  return (
    <div className="mt-12 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">Contribution Pulse</h3>
          <h2 className="text-xl font-bold text-white mt-1">Knowledge Sharing Activity</h2>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
           {["daily", "weekly", "monthly", "yearly"].map((v) => (
             <button
               key={v}
               onClick={() => setView(v)}
               className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 view === v ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
               }`}
             >
               {v}
             </button>
           ))}
        </div>
      </header>

      <div className="h-[300px] w-full">
        {loading ? (
           <div className="h-full w-full flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
           </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0a0a0a", 
                  border: "1px solid #ffffff10", 
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff" 
                }}
                itemStyle={{ color: "#6366f1" }}
                cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "5 5" }}
              />
              <Area
                type="monotone"
                dataKey="notes"
                stroke="#6366f1"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorNotes)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
