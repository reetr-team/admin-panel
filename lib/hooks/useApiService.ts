"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { ApiService } from "../api-service";

export function useApiService() {
  const { user, isLoading } = useUser();
  const [apiService, setApiService] = useState<ApiService | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Create a new API service instance for client-side usage
      const service = new ApiService();

      if (user) {
        // For now, we'll create the service without the token
        // The token will be set server-side when needed
        console.log("Client-side: API service initialized");
      }

      setApiService(service);
    }
  }, [user, isLoading]);

  return { apiService, isLoading: isLoading || !apiService };
}
