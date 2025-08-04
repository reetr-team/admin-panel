"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-utils";
import LifeHackForm from "./LifeHackForm";
import Toast from "./Toast";

// Add PATCH and DELETE functions
const apiPatch = async (endpoint: string, accessToken: string, body: any) => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
  const response = await fetch(`${BACKEND_API}${endpoint}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
};

const apiDelete = async (endpoint: string, accessToken: string) => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
  const response = await fetch(`${BACKEND_API}${endpoint}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

interface LifeHacksTabProps {
  backendAccessToken: string | null;
}

export default function LifeHacksTab({
  backendAccessToken,
}: LifeHacksTabProps) {
  const [activeLifeHacks, setActiveLifeHacks] = useState([]);
  const [archivedLifeHacks, setArchivedLifeHacks] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("create");
  const [editingLifeHack, setEditingLifeHack] = useState(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [expandedActiveCategories, setExpandedActiveCategories] = useState<
    Set<string>
  >(new Set());
  const [expandedArchivedCategories, setExpandedArchivedCategories] = useState<
    Set<string>
  >(new Set());

  // Fetch active life hacks
  const fetchActiveLifeHacks = async () => {
    if (backendAccessToken) {
      try {
        const lifeHacksResponse = await apiGet(
          "/v1/life-hacks/",
          backendAccessToken
        );
        console.log("Active life hacks fetched:", lifeHacksResponse);
        setActiveLifeHacks(lifeHacksResponse.data || lifeHacksResponse || []);
      } catch (error) {
        console.error("Failed to fetch active life hacks:", error);
      }
    }
  };

  // Fetch archived life hacks
  const fetchArchivedLifeHacks = async () => {
    if (backendAccessToken) {
      try {
        const lifeHacksResponse = await apiGet(
          "/v1/life-hacks/?is_active=false",
          backendAccessToken
        );
        console.log("Archived life hacks fetched:", lifeHacksResponse);
        setArchivedLifeHacks(lifeHacksResponse.data || lifeHacksResponse || []);
      } catch (error) {
        console.error("Failed to fetch archived life hacks:", error);
      }
    }
  };

  // Fetch both active and archived life hacks
  const fetchAllLifeHacks = async () => {
    await Promise.all([fetchActiveLifeHacks(), fetchArchivedLifeHacks()]);
  };

  // Fetch life hacks when Edit tab is accessed
  useEffect(() => {
    if (activeSubTab === "edit") {
      fetchAllLifeHacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubTab, backendAccessToken]);

  const handleEditCancel = () => {
    setEditingLifeHack(null);
  };

  const toggleActiveCategory = (category: string) => {
    setExpandedActiveCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleArchivedCategory = (category: string) => {
    setExpandedArchivedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleEditSuccess = () => {
    setEditingLifeHack(null);
    fetchAllLifeHacks(); // Refresh both lists after successful update
  };

  const handleArchiveToggle = async (lifeHack: any) => {
    if (!backendAccessToken) return;

    try {
      const newActiveState = !lifeHack.isActive;
      await apiPatch(`/v1/life-hacks/${lifeHack.id}`, backendAccessToken, {
        isActive: newActiveState,
      });

      console.log(
        `Life hack ${newActiveState ? "unarchived" : "archived"}:`,
        lifeHack.id
      );
      setToast({
        message: `Life hack ${
          newActiveState ? "unarchived" : "archived"
        } successfully!`,
        type: "success",
      });

      // Refresh both lists
      fetchAllLifeHacks();
    } catch (error) {
      console.error("Error toggling archive status:", error);
      setToast({
        message: "Error updating life hack status",
        type: "error",
      });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Life Hacks Management
        </h2>

        {/* Sub Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSubTab("create")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === "create"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveSubTab("edit")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === "edit"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Edit
            </button>
          </nav>
        </div>

        {/* Create Sub Tab */}
        {activeSubTab === "create" && (
          <LifeHackForm
            backendAccessToken={backendAccessToken}
            isEditMode={false}
            onToast={(message, type) => setToast({ message, type })}
          />
        )}

        {/* Edit Sub Tab - List View */}
        {activeSubTab === "edit" && !editingLifeHack && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-6">
              Edit Life Hacks
            </h3>

            {/* Active Life Hacks Section */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Active Life Hacks
              </h4>
              {activeLifeHacks.length === 0 ? (
                <p className="text-gray-500">
                  No active life hacks found. Create some first!
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(
                    activeLifeHacks.reduce((acc: any, lifeHack: any) => {
                      const category = lifeHack.category || "uncategorized";
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(lifeHack);
                      return acc;
                    }, {})
                  ).map(([category, categoryLifeHacks]: [string, any]) => {
                    const isExpanded = expandedActiveCategories.has(category);
                    return (
                      <div key={category}>
                        <button
                          onClick={() => toggleActiveCategory(category)}
                          className="flex items-center justify-between w-full py-2 px-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg mb-3"
                        >
                          <h5 className="font-medium text-gray-900 capitalize">
                            {category.replace("-", " ")} (
                            {(categoryLifeHacks as any[]).length})
                          </h5>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="space-y-3 mb-4">
                            {(categoryLifeHacks as any[]).map(
                              (lifeHack: any, index: number) => (
                                <div
                                  key={lifeHack.id || index}
                                  className="border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h6 className="font-medium text-gray-900 mb-1">
                                        {lifeHack.type || "Untitled"}
                                      </h6>
                                      <p className="text-sm text-gray-600 mb-2">
                                        {lifeHack.description}
                                      </p>
                                      <div className="flex gap-4 text-xs text-gray-500">
                                        <span>
                                          Category: {lifeHack.category}
                                        </span>
                                        <span>
                                          Daily:{" "}
                                          {lifeHack.isDaily ? "Yes" : "No"}
                                        </span>
                                        <span>
                                          Time: {lifeHack.defaultTime}
                                        </span>
                                        <span>Day: {lifeHack.defaultDay}</span>
                                      </div>
                                      {lifeHack.guidedPrompts &&
                                        lifeHack.guidedPrompts.length > 0 && (
                                          <div className="mt-2">
                                            <span className="text-xs text-gray-500">
                                              Guided Prompts:
                                            </span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                              {lifeHack.guidedPrompts.map(
                                                (
                                                  prompt: string,
                                                  promptIndex: number
                                                ) => (
                                                  <li key={promptIndex}>
                                                    {prompt}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          setEditingLifeHack(lifeHack)
                                        }
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleArchiveToggle(lifeHack)
                                        }
                                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                      >
                                        Archive
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Archived Life Hacks Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Archived Life Hacks
              </h4>
              {archivedLifeHacks.length === 0 ? (
                <p className="text-gray-500">No archived life hacks.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(
                    archivedLifeHacks.reduce((acc: any, lifeHack: any) => {
                      const category = lifeHack.category || "uncategorized";
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(lifeHack);
                      return acc;
                    }, {})
                  ).map(([category, categoryLifeHacks]: [string, any]) => {
                    const isExpanded = expandedArchivedCategories.has(category);
                    return (
                      <div key={category}>
                        <button
                          onClick={() => toggleArchivedCategory(category)}
                          className="flex items-center justify-between w-full py-2 px-3 text-left bg-red-50 hover:bg-red-100 rounded-lg mb-3"
                        >
                          <h5 className="font-medium text-gray-900 capitalize">
                            {category.replace("-", " ")} (
                            {(categoryLifeHacks as any[]).length})
                          </h5>
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="space-y-3 mb-4">
                            {(categoryLifeHacks as any[]).map(
                              (lifeHack: any, index: number) => (
                                <div
                                  key={lifeHack.id || index}
                                  className="border border-red-200 bg-red-50 rounded-lg p-4"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <h6 className="font-medium text-gray-900">
                                          {lifeHack.type || "Untitled"}
                                        </h6>
                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                          Archived
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">
                                        {lifeHack.description}
                                      </p>
                                      <div className="flex gap-4 text-xs text-gray-500">
                                        <span>
                                          Category: {lifeHack.category}
                                        </span>
                                        <span>
                                          Daily:{" "}
                                          {lifeHack.isDaily ? "Yes" : "No"}
                                        </span>
                                        <span>
                                          Time: {lifeHack.defaultTime}
                                        </span>
                                        <span>Day: {lifeHack.defaultDay}</span>
                                      </div>
                                      {lifeHack.guidedPrompts &&
                                        lifeHack.guidedPrompts.length > 0 && (
                                          <div className="mt-2">
                                            <span className="text-xs text-gray-500">
                                              Guided Prompts:
                                            </span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                              {lifeHack.guidedPrompts.map(
                                                (
                                                  prompt: string,
                                                  promptIndex: number
                                                ) => (
                                                  <li key={promptIndex}>
                                                    {prompt}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleArchiveToggle(lifeHack)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                      >
                                        Unarchive
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Sub Tab - Edit Form */}
        {activeSubTab === "edit" && editingLifeHack && (
          <LifeHackForm
            backendAccessToken={backendAccessToken}
            isEditMode={true}
            initialData={editingLifeHack}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
            onToast={(message, type) => setToast({ message, type })}
          />
        )}
      </div>
    </>
  );
}
