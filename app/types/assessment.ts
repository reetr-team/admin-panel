export interface AssessmentQuestion {
  id: number;
  questionText: string;
  inputType: "radio" | "slider" | "text" | "textarea" | "multiselect";
  options?: string[];
  sliderMin?: number;
  sliderMax?: number;
  sliderLabels?: {
    minLabel: string;
    maxLabel: string;
  };
  placeholder?: string;
  maxSelections?: number;
  required: boolean;
  conditionalLogic?: {
    dependsOnStageId: number;
    dependsOnQuestionId: number;
    showWhenValueIn: string[];
  };
  finalQuestion?: boolean;
}

export interface AssessmentStage {
  id: number;
  title: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentCTA {
  buttonText: string;
  webRoute: string;
  nativeRoute: string;
}

export interface AssessmentData {
  id: number;
  title: string;
  description: string;
  stages: AssessmentStage[];
  estimatedTime: number;
  assessmentCTA?: AssessmentCTA;
}

export interface AssessmentFormData {
  title: string;
  description: string;
  estimatedTime: number;
  stages: AssessmentStage[];
  assessmentCTA: AssessmentCTA;
}