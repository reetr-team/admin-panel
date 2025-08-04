"use client";

import { useState, useEffect } from "react";
import AssessmentForm from "./AssessmentForm";
import { AssessmentData } from "@/app/types/assessment";

// Mock data for testing
const mockAssessmentData: AssessmentData = {
  id: 1,
  title: "Discovery Assessment",
  description: "Help us understand your current life situation to provide personalized guidance.",
  estimatedTime: 15,
  stages: [
    {
      id: 1,
      title: "Relationship Status",
      questions: [
        {
          id: 1,
          questionText: "What best describes your current relationship status?",
          inputType: "radio",
          options: ["Married", "Engaged", "Dating", "Single", "Divorced", "Widowed"],
          required: true,
        },
      ],
    },
    {
      id: 2,
      title: "Family Context",
      questions: [
        {
          id: 1,
          questionText: "Do you have any children?",
          inputType: "radio",
          options: ["Yes", "No"],
          required: true,
        },
      ],
    },
  ],
  assessmentCTA: {
    buttonText: "Meet Your Coach",
    webRoute: "/coach",
    nativeRoute: "/(tabs)/coach"
  }
};

interface EditAssessmentTabProps {
  backendAccessToken: string | null;
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function EditAssessmentTab({ backendAccessToken, onToast }: EditAssessmentTabProps) {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentData | null>(null);

  // Mock API calls for assessments
  const fetchAssessments = async () => {
    try {
      // Mock API call - in real implementation, this would be an actual API call
      console.log("Fetching assessments (mock)...");
      setAssessments([mockAssessmentData]);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
      onToast("Failed to fetch assessments", "error");
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [backendAccessToken]);

  const handleEditSuccess = () => {
    setEditingAssessment(null);
    fetchAssessments();
  };

  const handleEditCancel = () => {
    setEditingAssessment(null);
  };

  const handleDelete = async (assessment: AssessmentData) => {
    try {
      // Mock API call
      console.log("Deleting assessment (mock):", assessment.id);
      onToast("Assessment deleted successfully!", "success");
      fetchAssessments();
    } catch (error) {
      console.error("Error deleting assessment:", error);
      onToast("Error deleting assessment", "error");
    }
  };

  // List View
  if (!editingAssessment) {
    return (
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-6">
          Edit Assessments
        </h3>

        {assessments.length === 0 ? (
          <p className="text-gray-500">
            No assessments found. Create some first!
          </p>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {assessment.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {assessment.description}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500 mb-3">
                      <span>Estimated Time: {assessment.estimatedTime} minutes</span>
                      <span>Stages: {assessment.stages.length}</span>
                      <span>
                        Total Questions:{" "}
                        {assessment.stages.reduce(
                          (total, stage) => total + stage.questions.length,
                          0
                        )}
                      </span>
                    </div>
                    
                    {/* Stage Preview */}
                    <div className="bg-gray-50 rounded-md p-3 mb-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">
                        Stages:
                      </h5>
                      <div className="space-y-1">
                        {assessment.stages.map((stage, index) => (
                          <div key={stage.id} className="text-xs text-gray-600">
                            <span className="font-medium">
                              {index + 1}. {stage.title}
                            </span>
                            <span className="ml-2 text-gray-400">
                              ({stage.questions.length} questions)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Preview */}
                    {assessment.assessmentCTA && (
                      <div className="bg-blue-50 rounded-md p-3">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">
                          Call to Action:
                        </h5>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Button:</span> {assessment.assessmentCTA.buttonText}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Web Route:</span> {assessment.assessmentCTA.webRoute}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Native Route:</span> {assessment.assessmentCTA.nativeRoute}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingAssessment(assessment)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assessment)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit Form View
  return (
    <AssessmentForm
      backendAccessToken={backendAccessToken}
      isEditMode={true}
      initialData={editingAssessment}
      onSuccess={handleEditSuccess}
      onCancel={handleEditCancel}
      onToast={onToast}
    />
  );
}