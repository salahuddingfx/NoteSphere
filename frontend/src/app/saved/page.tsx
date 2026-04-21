import MainNav from "@/components/ui/MainNav";

const savedItems = [
  "Final Exam Preparation - Fluid Mechanics",
  "DLD Midterm Essential Questions",
  "Transportation Engineering Important Problems",
];

export default function SavedPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <MainNav />
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/55 p-8 backdrop-blur md:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Saved Collection</p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-100">Your personal shelf</h1>
        <p className="mt-3 text-zinc-300">Build focused collections for finals and assignments.</p>

        <div className="mt-8 space-y-3">
          {savedItems.map((item) => (
            <article key={item} className="rounded-xl border border-zinc-800 bg-zinc-950/75 p-4">
              <p className="text-zinc-100">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
