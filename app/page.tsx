import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import AdminDashboard from "./components/AdminDashboard";
import "./globals.css";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, always redirect to login
  if (!session) {
    redirect("/auth/login");
  }

  // If session exists, show admin dashboard
  return <AdminDashboard user={session.user} />;
}
