import MainNav from "@/components/ui/MainNav";

const requests = [
  { subject: "Heat Transfer", department: "ME", semester: "5th", votes: 44 },
  { subject: "Compiler Design", department: "CSE", semester: "6th", votes: 32 },
  { subject: "Structural Analysis-II", department: "Civil", semester: "4th", votes: 28 },
];

export default function RequestsPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/55 p-8 backdrop-blur md:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Request Notes</p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-100">Most requested first</h1>
        <p className="mt-3 text-zinc-300">
          This is your viral growth engine. Let students request missing notes and upvote the most important ones.
        </p>

        <div className="mt-8 space-y-3">
          {requests.map((item) => (
            <article
              key={item.subject}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/75 p-4"
            >
              <div>
                <p className="font-semibold text-zinc-100">{item.subject}</p>
                <p className="text-sm text-zinc-400">
                  {item.department} • {item.semester}
                </p>
              </div>
              <button className="rounded-lg border border-cyan-400/60 px-3 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10">
                Upvote ({item.votes})
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
