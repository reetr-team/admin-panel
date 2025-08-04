"use client";

import { useState } from "react";
import { AssessmentFormData, AssessmentStage, AssessmentQuestion } from "@/app/types/assessment";

interface AssessmentFormProps {
  backendAccessToken: string | null;
  isEditMode?: boolean;
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  onToast?: (message: string, type: "success" | "error" | "info") => void;
}

export default function AssessmentForm({
  isEditMode = false,
  initialData = null,
  onSuccess,
  onCancel,
  onToast
}: AssessmentFormProps) {
  const [submittedData, setSubmittedData] = useState<AssessmentFormData | null>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    estimatedTime: initialData?.estimatedTime || 15,
    stages: initialData?.stages || [
      {
        id: 1,
        title: "",
        questions: [
          {
            id: 1,
            questionText: "",
            inputType: "radio",
            options: ["", ""],
            required: true,
          }
        ]
      }
    ],
    assessmentCTA: initialData?.assessmentCTA || {
      buttonText: "",
      webRoute: "",
      nativeRoute: ""
    }
  });

  const addStage = () => {
    const newStageId = formData.stages.length + 1;
    const newStage: AssessmentStage = {
      id: newStageId,
      title: "",
      questions: [
        {
          id: 1,
          questionText: "",
          inputType: "radio",
          options: ["", ""],
          required: true,
        }
      ]
    };
    setFormData({
      ...formData,
      stages: [...formData.stages, newStage]
    });
  };

  const removeStage = (stageIndex: number) => {
    if (formData.stages.length <= 1) {
      onToast?.("Assessment must have at least one stage", "error");
      return;
    }
    const filteredStages = formData.stages.filter((_, index) => index !== stageIndex);
    const renumberedStages = renumberStagesAndQuestions(filteredStages);
    setFormData({
      ...formData,
      stages: renumberedStages
    });
  };

  const updateStage = (stageIndex: number, field: keyof AssessmentStage, value: any) => {
    const newStages = [...formData.stages];
    newStages[stageIndex] = { ...newStages[stageIndex], [field]: value };
    setFormData({ ...formData, stages: newStages });
  };

  const addQuestion = (stageIndex: number) => {
    const newQuestionId = formData.stages[stageIndex].questions.length + 1;
    const newQuestion: AssessmentQuestion = {
      id: newQuestionId,
      questionText: "",
      inputType: "radio",
      options: ["", ""],
      required: true,
    };
    const newStages = [...formData.stages];
    newStages[stageIndex].questions.push(newQuestion);
    setFormData({ ...formData, stages: newStages });
  };

  const removeQuestion = (stageIndex: number, questionIndex: number) => {
    if (formData.stages[stageIndex].questions.length <= 1) {
      onToast?.("Stage must have at least one question", "error");
      return;
    }
    const newStages = [...formData.stages];
    newStages[stageIndex].questions = newStages[stageIndex].questions.filter((_, index) => index !== questionIndex);
    
    // Renumber questions in this stage
    newStages[stageIndex].questions = newStages[stageIndex].questions.map((question, index) => ({
      ...question,
      id: index + 1
    }));
    
    setFormData({ ...formData, stages: newStages });
  };

  const updateQuestion = (stageIndex: number, questionIndex: number, field: keyof AssessmentQuestion, value: any) => {
    const newStages = [...formData.stages];
    const question = newStages[stageIndex].questions[questionIndex];
    
    // Handle input type changes to set appropriate default options
    if (field === 'inputType') {
      if (value === 'radio' || value === 'multiselect') {
        question.options = ["", ""];
      } else {
        // Clear options for non-option input types
        delete question.options;
        delete question.maxSelections;
        delete question.sliderMin;
        delete question.sliderMax;
        delete question.sliderLabels;
        delete question.placeholder;
      }
      
      // Set default values for slider
      if (value === 'slider') {
        question.sliderMin = 0;
        question.sliderMax = 10;
        question.sliderLabels = { minLabel: "", maxLabel: "" };
      }
    }
    
    newStages[stageIndex].questions[questionIndex] = {
      ...question,
      [field]: value
    };
    setFormData({ ...formData, stages: newStages });
  };

  const addOption = (stageIndex: number, questionIndex: number) => {
    const newStages = [...formData.stages];
    const question = newStages[stageIndex].questions[questionIndex];
    if (!question.options) question.options = [];
    question.options.push("");
    setFormData({ ...formData, stages: newStages });
  };

  const removeOption = (stageIndex: number, questionIndex: number, optionIndex: number) => {
    const newStages = [...formData.stages];
    const question = newStages[stageIndex].questions[questionIndex];
    if (question.options && question.options.length > 2) {
      question.options = question.options.filter((_, index) => index !== optionIndex);
      setFormData({ ...formData, stages: newStages });
    } else {
      onToast?.("Radio and multiselect questions must have at least 2 options", "error");
    }
  };

  const updateOption = (stageIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const newStages = [...formData.stages];
    const question = newStages[stageIndex].questions[questionIndex];
    if (question.options) {
      question.options[optionIndex] = value;
      setFormData({ ...formData, stages: newStages });
    }
  };

  const renumberStagesAndQuestions = (stages: AssessmentStage[]) => {
    return stages.map((stage, stageIndex) => ({
      ...stage,
      id: stageIndex + 1,
      questions: stage.questions.map((question, questionIndex) => ({
        ...question,
        id: questionIndex + 1
      }))
    }));
  };

  // Helper function to check if a question is being depended upon by other questions
  const isQuestionBeingDependedUpon = (targetStageIndex: number, targetQuestionIndex: number) => {
    const targetStage = formData.stages[targetStageIndex];
    const targetQuestion = targetStage?.questions[targetQuestionIndex];
    
    if (!targetStage || !targetQuestion) return false;

    // Check all questions in all stages to see if any depend on this question
    return formData.stages.some((stage, stageIndex) =>
      stage.questions.some((question) =>
        question.conditionalLogic &&
        question.conditionalLogic.dependsOnStageId === targetStage.id &&
        question.conditionalLogic.dependsOnQuestionId === targetQuestion.id
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description) {
      onToast?.("Please fill in title and description", "error");
      return;
    }

    if (!formData.assessmentCTA.buttonText || !formData.assessmentCTA.webRoute || !formData.assessmentCTA.nativeRoute) {
      onToast?.("Please fill in all CTA fields", "error");
      return;
    }

    if (formData.stages.length === 0) {
      onToast?.("Assessment must have at least one stage", "error");
      return;
    }

    // Validate stages and questions
    for (let i = 0; i < formData.stages.length; i++) {
      const stage = formData.stages[i];
      if (!stage.title) {
        onToast?.(`Stage ${i + 1} must have a title`, "error");
        return;
      }
      
      for (let j = 0; j < stage.questions.length; j++) {
        const question = stage.questions[j];
        if (!question.questionText) {
          onToast?.(`Stage ${i + 1}, Question ${j + 1} must have question text`, "error");
          return;
        }
        
        if ((question.inputType === "radio" || question.inputType === "multiselect") && 
            (!question.options || question.options.some(opt => !opt.trim()))) {
          onToast?.(`Stage ${i + 1}, Question ${j + 1} must have valid options`, "error");
          return;
        }
      }
    }

    try {
      // Ensure proper numbering before submission
      const finalData = {
        ...formData,
        stages: renumberStagesAndQuestions(formData.stages)
      };
      
      // Mock API call for now
      console.log(`${isEditMode ? 'Updating' : 'Creating'} assessment:`, finalData);
      
      // Store the submitted data to display
      setSubmittedData({ ...finalData });
      
      onToast?.(`Assessment ${isEditMode ? 'updated' : 'created'} successfully!`, "success");

      if (onSuccess) {
        onSuccess();
      }

      // Reset form only in create mode
      if (!isEditMode) {
        setFormData({
          title: "",
          description: "",
          estimatedTime: 15,
          stages: [
            {
              id: 1,
              title: "",
              questions: [
                {
                  id: 1,
                  questionText: "",
                  inputType: "radio",
                  options: ["", ""],
                  required: true,
                }
              ]
            }
          ],
          assessmentCTA: {
            buttonText: "",
            webRoute: "",
            nativeRoute: ""
          }
        });
        // Don't clear submitted data on reset so user can still see results
      }
    } catch (error) {
      console.error("Error:", error);
      onToast?.(`Error ${isEditMode ? 'updating' : 'creating'} assessment`, "error");
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {isEditMode ? 'Update Assessment' : 'Create New Assessment'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Assessment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) || 15 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Stages */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Assessment Stages
            </label>
            <button
              type="button"
              onClick={addStage}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              Add Stage
            </button>
          </div>

          <div className="space-y-6">
            {formData.stages.map((stage, stageIndex) => (
              <div key={stage.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Stage {stageIndex + 1}
                  </h4>
                  {formData.stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStage(stageIndex)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Remove Stage
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={stage.title}
                    onChange={(e) => updateStage(stageIndex, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Questions for this stage */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Questions
                    </label>
                    <button
                      type="button"
                      onClick={() => addQuestion(stageIndex)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {stage.questions.map((question, questionIndex) => (
                      <div key={question.id} className="border border-gray-200 rounded-md p-3 bg-white">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="text-md font-medium text-gray-800">
                            Question {questionIndex + 1}
                          </h5>
                          {stage.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(stageIndex, questionIndex)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Question Text *
                            </label>
                            <input
                              type="text"
                              required
                              value={question.questionText}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'questionText', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Input Type
                            </label>
                            <select
                              value={question.inputType}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'inputType', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                            >
                              <option value="radio">Radio</option>
                              <option value="slider">Slider</option>
                              <option value="text">Text</option>
                              <option value="textarea">Textarea</option>
                              <option value="multiselect">Multi-select</option>
                            </select>
                          </div>
                        </div>

                        {/* Options for radio and multiselect */}
                        {(question.inputType === "radio" || question.inputType === "multiselect") && (
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-xs font-medium text-gray-700">
                                Options {isQuestionBeingDependedUpon(stageIndex, questionIndex) && (
                                  <span className="text-orange-600 font-normal">(Disabled - being used by conditional logic)</span>
                                )}
                              </label>
                              <button
                                type="button"
                                onClick={() => addOption(stageIndex, questionIndex)}
                                disabled={isQuestionBeingDependedUpon(stageIndex, questionIndex)}
                                className={`px-2 py-1 rounded text-xs ${
                                  isQuestionBeingDependedUpon(stageIndex, questionIndex) 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                              >
                                Add Option
                              </button>
                            </div>
                            <div className="space-y-1">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(stageIndex, questionIndex, optionIndex, e.target.value)}
                                    disabled={isQuestionBeingDependedUpon(stageIndex, questionIndex)}
                                    className={`flex-1 px-2 py-1 border rounded text-sm ${
                                      isQuestionBeingDependedUpon(stageIndex, questionIndex)
                                        ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600'
                                    }`}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                  {question.options && question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeOption(stageIndex, questionIndex, optionIndex)}
                                      disabled={isQuestionBeingDependedUpon(stageIndex, questionIndex)}
                                      className={`px-2 py-1 rounded text-xs ${
                                        isQuestionBeingDependedUpon(stageIndex, questionIndex)
                                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                          : 'bg-red-500 text-white hover:bg-red-600'
                                      }`}
                                    >
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            {isQuestionBeingDependedUpon(stageIndex, questionIndex) && (
                              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                                <p className="text-xs text-orange-800">
                                  <strong>Options are disabled:</strong> This question is being used by other questions&apos; conditional logic. Modifying its options would break the conditional dependencies.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Slider specific fields */}
                        {question.inputType === "slider" && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Min Value
                              </label>
                              <input
                                type="number"
                                value={question.sliderMin || 0}
                                onChange={(e) => updateQuestion(stageIndex, questionIndex, 'sliderMin', parseInt(e.target.value))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Max Value
                              </label>
                              <input
                                type="number"
                                value={question.sliderMax || 10}
                                onChange={(e) => updateQuestion(stageIndex, questionIndex, 'sliderMax', parseInt(e.target.value))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Min Label
                              </label>
                              <input
                                type="text"
                                value={question.sliderLabels?.minLabel || ""}
                                onChange={(e) => updateQuestion(stageIndex, questionIndex, 'sliderLabels', {
                                  ...question.sliderLabels,
                                  minLabel: e.target.value
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Max Label
                              </label>
                              <input
                                type="text"
                                value={question.sliderLabels?.maxLabel || ""}
                                onChange={(e) => updateQuestion(stageIndex, questionIndex, 'sliderLabels', {
                                  ...question.sliderLabels,
                                  maxLabel: e.target.value
                                })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        )}

                        {/* Text/Textarea placeholder */}
                        {(question.inputType === "text" || question.inputType === "textarea") && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Placeholder
                            </label>
                            <input
                              type="text"
                              value={question.placeholder || ""}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'placeholder', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}

                        {/* Multiselect max selections */}
                        {question.inputType === "multiselect" && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Max Selections
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={question.maxSelections || ""}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'maxSelections', parseInt(e.target.value) || undefined)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`required-${stageIndex}-${questionIndex}`}
                              checked={question.required}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'required', e.target.checked)}
                              className="h-3 w-3 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`required-${stageIndex}-${questionIndex}`} className="ml-1 text-xs text-gray-700">
                              Required
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`final-${stageIndex}-${questionIndex}`}
                              checked={question.finalQuestion || false}
                              onChange={(e) => updateQuestion(stageIndex, questionIndex, 'finalQuestion', e.target.checked)}
                              className="h-3 w-3 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`final-${stageIndex}-${questionIndex}`} className="ml-1 text-xs text-gray-700">
                              Final Question
                            </label>
                          </div>
                          {/* Only show conditional logic for questions that aren't the first question and have previous stages */}
                          {!(stageIndex === 0 && questionIndex === 0) && stageIndex > 0 && (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`conditional-${stageIndex}-${questionIndex}`}
                                checked={!!question.conditionalLogic}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Only allow if there are previous stages
                                  if (stageIndex > 0) {
                                    updateQuestion(stageIndex, questionIndex, 'conditionalLogic', {
                                      dependsOnStageId: formData.stages[0].id, // Default to first stage
                                      dependsOnQuestionId: formData.stages[0].questions[0]?.id || 1,
                                      showWhenValueIn: []
                                    });
                                  }
                                } else {
                                  updateQuestion(stageIndex, questionIndex, 'conditionalLogic', undefined);
                                }
                              }}
                              className="h-3 w-3 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                            />
                              <label htmlFor={`conditional-${stageIndex}-${questionIndex}`} className="ml-1 text-xs text-gray-700">
                                Conditional Logic
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Conditional Logic Configuration */}
                        {question.conditionalLogic && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <h6 className="text-xs font-medium text-blue-800 mb-2">Conditional Logic Settings</h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Depends on Stage
                                </label>
                                <select
                                  value={question.conditionalLogic.dependsOnStageId}
                                  onChange={(e) => {
                                    const newStageId = parseInt(e.target.value);
                                    const newConditionalLogic = {
                                      ...question.conditionalLogic,
                                      dependsOnStageId: newStageId,
                                      dependsOnQuestionId: 1, // Reset to first question of selected stage
                                      showWhenValueIn: []
                                    };
                                    updateQuestion(stageIndex, questionIndex, 'conditionalLogic', newConditionalLogic);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                >
                                  {/* Get only previous stages (not current stage) */}
                                  {formData.stages.slice(0, stageIndex).length > 0 ? (
                                    formData.stages.slice(0, stageIndex).map((stage, sIndex) => (
                                      <option key={sIndex} value={stage.id}>
                                        Stage {sIndex + 1}: {stage.title || 'Untitled'}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="">No previous stages available</option>
                                  )}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Depends on Question
                                </label>
                                <select
                                  value={question.conditionalLogic.dependsOnQuestionId}
                                  onChange={(e) => {
                                    const newConditionalLogic = {
                                      ...question.conditionalLogic,
                                      dependsOnQuestionId: parseInt(e.target.value),
                                      showWhenValueIn: []
                                    };
                                    updateQuestion(stageIndex, questionIndex, 'conditionalLogic', newConditionalLogic);
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                >
                                  {(() => {
                                    // Find the selected stage and get its questions
                                    const selectedStage = formData.stages.find(s => s.id === question.conditionalLogic?.dependsOnStageId);
                                    
                                    if (selectedStage) {
                                      // Since we only allow previous stages, show all questions from the selected stage
                                      const questionsToShow = selectedStage.questions;
                                        
                                      return questionsToShow.map((q, qIndex) => (
                                        <option key={qIndex} value={q.id}>
                                          Question {qIndex + 1}: {q.questionText.substring(0, 30) || 'Untitled'}...
                                        </option>
                                      ));
                                    }
                                    return <option value="">No questions available</option>;
                                  })()}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Show when value is:
                                </label>
                                {(() => {
                                  // Find the dependent question to get its options
                                  const dependentStage = formData.stages.find(s => s.id === question.conditionalLogic?.dependsOnStageId);
                                  const dependentQuestion = dependentStage?.questions.find(q => q.id === question.conditionalLogic?.dependsOnQuestionId);
                                  
                                  if (dependentQuestion && dependentQuestion.options) {
                                    return (
                                      <div className="space-y-1 max-h-20 overflow-y-auto">
                                        {dependentQuestion.options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex items-center">
                                            <input
                                              type="checkbox"
                                              id={`condition-${stageIndex}-${questionIndex}-${optIndex}`}
                                              checked={question.conditionalLogic?.showWhenValueIn?.includes(option) || false}
                                              onChange={(e) => {
                                                const currentValues = question.conditionalLogic?.showWhenValueIn || [];
                                                const newValues = e.target.checked
                                                  ? [...currentValues, option]
                                                  : currentValues.filter(v => v !== option);
                                                
                                                const newConditionalLogic = {
                                                  ...question.conditionalLogic,
                                                  showWhenValueIn: newValues
                                                };
                                                updateQuestion(stageIndex, questionIndex, 'conditionalLogic', newConditionalLogic);
                                              }}
                                              className="h-3 w-3 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                                            />
                                            <label htmlFor={`condition-${stageIndex}-${questionIndex}-${optIndex}`} className="ml-1 text-xs text-gray-700">
                                              {option}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <p className="text-xs text-gray-500 italic">
                                        Select a question with options above
                                      </p>
                                    );
                                  }
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Call to Action (CTA)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text *
              </label>
              <input
                type="text"
                required
                value={formData.assessmentCTA.buttonText}
                onChange={(e) => setFormData({
                  ...formData,
                  assessmentCTA: {
                    ...formData.assessmentCTA,
                    buttonText: e.target.value
                  }
                })}
                placeholder="e.g., Meet Your Coach"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Web Route *
              </label>
              <select
                required
                value={formData.assessmentCTA.webRoute}
                onChange={(e) => setFormData({
                  ...formData,
                  assessmentCTA: {
                    ...formData.assessmentCTA,
                    webRoute: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select a route</option>
                <option value="/assessments">Dashboard/Assessments</option>
                <option value="/coach">Coach</option>
                <option value="/challenges">Challenges</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Native Route *
              </label>
              <select
                required
                value={formData.assessmentCTA.nativeRoute}
                onChange={(e) => setFormData({
                  ...formData,
                  assessmentCTA: {
                    ...formData.assessmentCTA,
                    nativeRoute: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select a route</option>
                <option value="/(tabs)/assessments">Assessments</option>
                <option value="/(tabs)/coach">Coach</option>
                <option value="/(tabs)/life-hacks">Life Hacks</option>
                <option value="/(tabs)/challenges">Challenges</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isEditMode && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {isEditMode ? 'Update Assessment' : 'Create Assessment'}
          </button>
        </div>
      </form>

      {/* Results Container */}
      {submittedData && (
        <div className="mt-8 border-t pt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Submitted Assessment Data
            </h3>
            <button
              onClick={() => setSubmittedData(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}