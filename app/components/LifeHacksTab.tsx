"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-utils";
import LifeHackForm from "./LifeHackForm";

interface LifeHacksTabProps {
  backendAccessToken: string | null;
}

export default function LifeHacksTab({
  backendAccessToken,
}: LifeHacksTabProps) {
  const [lifeHacks, setLifeHacks] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("create");
  const [editingLifeHack, setEditingLifeHack] = useState(null);

  // Fetch life hacks for Edit tab
  const fetchLifeHacks = async () => {
    if (backendAccessToken) {
      try {
        const lifeHacksResponse = await apiGet(
          "/v1/life-hacks/",
          backendAccessToken
        );
        console.log("Life hacks fetched:", lifeHacksResponse);
        setLifeHacks(lifeHacksResponse.data || lifeHacksResponse || []);
      } catch (error) {
        console.error("Failed to fetch life hacks:", error);
      }
    }
  };

  // Fetch life hacks when Edit tab is accessed
  useEffect(() => {
    if (activeSubTab === "edit") {
      fetchLifeHacks();
    }
  }, [activeSubTab, backendAccessToken]);

  const handleEditCancel = () => {
    setEditingLifeHack(null);
  };

  const handleEditSuccess = () => {
    setEditingLifeHack(null);
    fetchLifeHacks(); // Refresh the list after successful update
  };

  return (
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
        />
      )}

      {/* Edit Sub Tab - List View */}
      {activeSubTab === "edit" && !editingLifeHack && (
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Edit Life Hacks</h3>
          {lifeHacks.length === 0 ? (
            <p className="text-gray-500">No life hacks found. Create some first!</p>
          ) : (
            <div className="space-y-6">
              {/* Group by category */}
              {Object.entries(
                lifeHacks.reduce((acc: any, lifeHack: any) => {
                  const category = lifeHack.category || 'uncategorized';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(lifeHack);
                  return acc;
                }, {})
              ).map(([category, categoryLifeHacks]: [string, any]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">
                    {category.replace('-', ' ')} ({(categoryLifeHacks as any[]).length})
                  </h4>
                  <div className="space-y-3">
                    {(categoryLifeHacks as any[]).map((lifeHack: any, index: number) => (
                      <div key={lifeHack.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{lifeHack.type || 'Untitled'}</h4>
                            <p className="text-sm text-gray-600 mb-2">{lifeHack.description}</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>Category: {lifeHack.category}</span>
                              <span>Daily: {lifeHack.isDaily ? 'Yes' : 'No'}</span>
                              <span>Time: {lifeHack.defaultTime}</span>
                              <span>Day: {lifeHack.defaultDay}</span>
                            </div>
                            {lifeHack.guidedPrompts && lifeHack.guidedPrompts.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">Guided Prompts:</span>
                                <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                  {lifeHack.guidedPrompts.map((prompt: string, promptIndex: number) => (
                                    <li key={promptIndex}>{prompt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => setEditingLifeHack(lifeHack)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
        />
      )}
    </div>
  );
}