"use client";

import AssessmentForm from "./AssessmentForm";

interface CreateAssessmentTabProps {
  backendAccessToken: string | null;
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function CreateAssessmentTab({ backendAccessToken, onToast }: CreateAssessmentTabProps) {
  return (
    <AssessmentForm
      backendAccessToken={backendAccessToken}
      isEditMode={false}
      onToast={onToast}
    />
  );
}