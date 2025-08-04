"use client";

import { useState } from "react";
import Toast from "./Toast";
import CreateAssessmentTab from "./CreateAssessmentTab";
import EditAssessmentTab from "./EditAssessmentTab";
import AssessmentDocumentationTab from "./AssessmentDocumentationTab";

interface AssessmentsTabProps {
  backendAccessToken: string | null;
}

export default function AssessmentsTab({ backendAccessToken }: AssessmentsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("create");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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
          Assessments Management
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
            <button
              onClick={() => setActiveSubTab("documentation")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === "documentation"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documentation
            </button>
          </nav>
        </div>

        {/* Create Sub Tab */}
        {activeSubTab === "create" && (
          <CreateAssessmentTab
            backendAccessToken={backendAccessToken}
            onToast={(message, type) => setToast({ message, type })}
          />
        )}

        {/* Edit Sub Tab */}
        {activeSubTab === "edit" && (
          <EditAssessmentTab
            backendAccessToken={backendAccessToken}
            onToast={(message, type) => setToast({ message, type })}
          />
        )}

        {/* Documentation Tab */}
        {activeSubTab === "documentation" && (
          <AssessmentDocumentationTab />
        )}
      </div>
    </>
  );
}