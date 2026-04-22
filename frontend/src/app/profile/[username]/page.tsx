import { Metadata } from "next";
import ProfileContent from "./ProfileContent";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/${params.username}`);
    const { user } = await res.json();
    
    return {
      title: `${user.name} (@${user.username}) | NoteSphere Portfolio`,
      description: user.bio || `Academic portfolio of ${user.name} on NoteSphere.`,
      openGraph: {
        title: user.name,
        images: [user.avatar],
      },
    };
  } catch (err) {
    return { title: "Student Profile | NoteSphere" };
  }
}

export default function PublicProfilePage() {
  return <ProfileContent />;
}
