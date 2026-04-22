import { Metadata } from "next";
import NoteContent from "./NoteContent";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${params.slug}`);
    const { note } = await res.json();
    
    return {
      title: `${note.title} | NoteSphere`,
      description: note.description.slice(0, 160),
      openGraph: {
        title: note.title,
        description: note.description.slice(0, 160),
        images: [note.fileType === 'image' ? note.fileUrl : '/og-image.png'],
      },
    };
  } catch (err) {
    return { title: "Note Details | NoteSphere" };
  }
}

export default function NoteDetailPage() {
  return <NoteContent />;
}
