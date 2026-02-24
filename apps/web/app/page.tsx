import { redirect } from "next/navigation";
import { auth } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await auth();
  redirect(session?.user ? "/dashboard" : "/login");
}
