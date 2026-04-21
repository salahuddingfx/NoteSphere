"use client";

export default function AdminNotesPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter">Vault Management</h1>
        <p className="text-zinc-500 mt-1">Review, verify, or archive academic notes.</p>
      </header>

      <section className="rounded-[3rem] border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="pb-6">Resource Title</th>
                  <th className="pb-6">Uploader</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 text-sm">
                {[
                  { title: "Advanced Calculus II", user: "Rahat", status: "Pending" },
                  { title: "Quantum Physics V1", user: "Nayeem", status: "Verified" },
                  { title: "Microprocessors Notes", user: "Sadia", status: "Flagged" },
                ].map((note, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 font-bold text-white">{note.title}</td>
                    <td className="py-6">{note.user}</td>
                    <td className="py-6 text-xs uppercase font-black tracking-widest">
                       <span className={note.status === "Verified" ? "text-green-400" : note.status === "Pending" ? "text-amber-400" : "text-red-400"}>
                          {note.status}
                       </span>
                    </td>
                    <td className="py-6 text-right">
                       <button className="rounded-xl bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}
