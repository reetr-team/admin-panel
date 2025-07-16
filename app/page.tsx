import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import AdminDashboard from "./components/AdminDashboard";
import { apiService } from "@/lib/api-service";
import "./globals.css";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, always redirect to login
  if (!session) {
    redirect("/auth/login");
  }

  // Extract and set the access token for API calls
  if (session.accessToken && typeof session.accessToken === 'string') {
    console.log("Setting access token for API service");
    apiService.setAccessToken(session.accessToken);
  } else {
    console.warn("No access token found in session");
  }

  // If session exists, show admin dashboard
  return <AdminDashboard user={session.user} />;
}
