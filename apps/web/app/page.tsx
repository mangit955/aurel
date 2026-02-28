import { redirect } from "next/navigation";
import { auth } from "./api/auth/[...nextauth]/route";
import HeroBackground from "./components/landing_page/Hero";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <HeroBackground />
    </div>
  );
}
