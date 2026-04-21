"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", notes: 4 },
  { name: "Tue", notes: 3 },
  { name: "Wed", notes: 6 },
  { name: "Thu", notes: 8 },
  { name: "Fri", notes: 5 },
  { name: "Sat", notes: 9 },
  { name: "Sun", notes: 12 },
];

export default function ContributionChart() {
  return (
    <div className="h-[300px] w-full mt-6 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="text-zinc-400 text-sm uppercase tracking-widest mb-6 font-bold">Contribution Activity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#666", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            hide 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff10", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#6366f1" }}
          />
          <Area
            type="monotone"
            dataKey="notes"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorNotes)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
