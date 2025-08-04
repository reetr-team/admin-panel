"use client";

import { useState, useEffect } from "react";
import { useApiService } from "@/lib/hooks/useApiService";
import { apiPost } from "@/lib/api-utils";
import LifeHacksTab from "./LifeHacksTab";
import AssessmentsTab from "./AssessmentsTab";

interface AdminDashboardProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  };
  accessToken: string;
}

export default function AdminDashboard({
  user,
  accessToken,
}: AdminDashboardProps) {
  const { apiService, isLoading: apiLoading } = useApiService();
  const [activeTab, setActiveTab] = useState("assessments");
  const [backendAccessToken, setBackendAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (apiService && !apiLoading) {
      console.log("API Service ready for Railway API calls");
    }

    // Make API call on component mount
    const makeApiCall = async () => {
      try {
        // Check if backend API is configured
        if (!process.env.NEXT_PUBLIC_BACKEND_API) {
          console.warn("NEXT_PUBLIC_BACKEND_API not configured, skipping backend authentication");
          return;
        }

        const body = {
          auth0_user_id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
        };
        const data = await apiPost("/v1/auth/auth0/token", accessToken, body);
        console.log("Backend API response:", data);
        
        // Store the backend access token
        if (data.access_token || data.data?.access_token) {
          const backendToken = data.access_token || data.data.access_token;
          setBackendAccessToken(backendToken);
        }
      } catch (error) {
        console.error("API call failed:", error);
        console.warn("Backend API not available, continuing with mock functionality");
      }
    };

    makeApiCall();
  }, [apiService, apiLoading, accessToken, user]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Reetr Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.name || user.email}</span>
              </div>
              <a
                href="/auth/logout"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("assessments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "assessments"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Assessments
            </button>
            <button
              onClick={() => setActiveTab("lifehacks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "lifehacks"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Life Hacks
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "assessments" && (
          <AssessmentsTab backendAccessToken={backendAccessToken} />
        )}

        {activeTab === "lifehacks" && (
          <LifeHacksTab backendAccessToken={backendAccessToken} />
        )}
      </main>
    </div>
  );
}
