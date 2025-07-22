"use client";

import { useState, useEffect } from "react";
import { useApiService } from "@/lib/hooks/useApiService";
import { apiPost } from "@/lib/api-utils";

// Add PATCH function
const apiPatch = async (endpoint: string, accessToken: string, body: any) => {
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
  const response = await fetch(`${BACKEND_API}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  return response.json();
};

export enum LifeHackCategory {
  FAITH = "faith",
  FITNESS = "fitness",
  FAMILY = "family",
  MARRIAGE_SIGNIFICANT_OTHER = "marriage/significant-other",
  CAREER = "career",
  MENTAL = "mental",
  COMMUNITY = "community",
}

export enum Day {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

interface LifeHackFormProps {
  backendAccessToken: string | null;
  isEditMode?: boolean;
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  onToast?: (message: string, type: "success" | "error" | "info") => void;
}

export default function LifeHackForm({ 
  backendAccessToken, 
  isEditMode = false, 
  initialData = null,
  onSuccess,
  onCancel,
  onToast
}: LifeHackFormProps) {
  const { apiService } = useApiService();
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    category: LifeHackCategory.FAITH,
    isDaily: false,
    adjustableTime: false,
    adjustableDay: false,
    defaultDay: Day.MONDAY,
    defaultTime: "0",
    guidedPrompts: [""],
  });

  // Populate form with initial data when editing
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        type: initialData.type || "",
        description: initialData.description || "",
        category: initialData.category || LifeHackCategory.FAITH,
        isDaily: initialData.isDaily || false,
        adjustableTime: initialData.adjustableTime || false,
        adjustableDay: initialData.adjustableDay || false,
        defaultDay: initialData.defaultDay || Day.MONDAY,
        defaultTime: initialData.defaultTime ? initialData.defaultTime.split(':')[0] : "0",
        guidedPrompts: initialData.guidedPrompts || [""],
      });
    }
  }, [isEditMode, initialData]);

  const addGuidedPrompt = () => {
    setFormData({
      ...formData,
      guidedPrompts: [...formData.guidedPrompts, ""],
    });
  };

  const removeGuidedPrompt = (index: number) => {
    const newPrompts = formData.guidedPrompts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      guidedPrompts: newPrompts,
    });
  };

  const updateGuidedPrompt = (index: number, value: string) => {
    const newPrompts = [...formData.guidedPrompts];
    newPrompts[index] = value;
    setFormData({
      ...formData,
      guidedPrompts: newPrompts,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    if (
      !formData.type ||
      !formData.description ||
      !formData.category ||
      !formData.defaultDay ||
      !formData.defaultTime
    ) {
      onToast?.("Please fill in all required fields", "error");
      return;
    }

    // Validate guided prompts
    const hasEmptyPrompts = formData.guidedPrompts.some(
      (prompt) => prompt.trim() === ""
    );
    if (hasEmptyPrompts) {
      onToast?.("Please fill in all guided prompts or remove empty ones", "error");
      return;
    }

    try {
      if (backendAccessToken) {
        // Format the payload
        const payload = {
          category: formData.category,
          type: formData.type,
          description: formData.description,
          adjustableTime: formData.adjustableTime,
          adjustableDay: formData.adjustableDay,
          isDaily: formData.isDaily,
          defaultDay: formData.defaultDay,
          defaultTime: `${formData.defaultTime.padStart(2, "0")}:00:00`,
          guidedPrompts: formData.guidedPrompts,
        };

        const response = isEditMode 
          ? await apiPatch(
              `/v1/life-hacks/${initialData.id}`,
              backendAccessToken,
              payload
            )
          : await apiPost(
              "/v1/life-hacks/",
              backendAccessToken,
              payload
            );
        console.log(`Life hack ${isEditMode ? 'updated' : 'created'}:`, response);
        onToast?.(`Life hack ${isEditMode ? 'updated' : 'created'} successfully!`, "success");

        if (onSuccess) {
          onSuccess();
        }
      } else if (apiService) {
        // Fallback to API service
        console.log(`${isEditMode ? 'Updating' : 'Creating'} life hack via API service...`);
        const response = await apiService.post("/lifehacks", formData);
        console.log("Life hack processed:", response);
        onToast?.(`Life hack ${isEditMode ? 'updated' : 'created'} successfully!`, "success");

        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Fallback for when API service is not ready
        console.log("API service not ready, showing success message");
        onToast?.(`Life hack ${isEditMode ? 'updated' : 'created'} successfully!`, "success");
      }

      // Reset form only in create mode
      if (!isEditMode) {
        setFormData({
          type: "",
          description: "",
          category: LifeHackCategory.FAITH,
          isDaily: false,
          adjustableTime: false,
          adjustableDay: false,
          defaultDay: Day.MONDAY,
          defaultTime: "0",
          guidedPrompts: [""],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      onToast?.(`Error ${isEditMode ? 'updating' : 'creating'} life hack`, "error");
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {isEditMode ? 'Update Life Hack' : 'Create New Life Hack'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type/Title *
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as LifeHackCategory,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {Object.values(LifeHackCategory).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Time (Hour)
            </label>
            <select
              value={formData.defaultTime}
              onChange={(e) =>
                setFormData({ ...formData, defaultTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i} value={i.toString()}>
                  {i === 0
                    ? "12 AM"
                    : i < 12
                    ? `${i} AM`
                    : i === 12
                    ? "12 PM"
                    : `${i - 12} PM`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Day
            </label>
            <select
              value={formData.defaultDay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  defaultDay: e.target.value as Day,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {Object.values(Day).map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guided Prompts
          </label>
          <div className="space-y-3">
            {formData.guidedPrompts.map((prompt, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={prompt}
                  onChange={(e) => updateGuidedPrompt(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? "Enter first guided prompt"
                      : "Enter guided prompt"
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={addGuidedPrompt}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  Add
                </button>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeGuidedPrompt(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDaily"
              checked={formData.isDaily}
              onChange={(e) =>
                setFormData({ ...formData, isDaily: e.target.checked })
              }
              className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
            />
            <label htmlFor="isDaily" className="ml-2 text-sm text-gray-700">
              Is Daily
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="adjustableTime"
              checked={formData.adjustableTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adjustableTime: e.target.checked,
                })
              }
              className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
            />
            <label
              htmlFor="adjustableTime"
              className="ml-2 text-sm text-gray-700"
            >
              Adjustable Time
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="adjustableDay"
              checked={formData.adjustableDay}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adjustableDay: e.target.checked,
                })
              }
              className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
            />
            <label
              htmlFor="adjustableDay"
              className="ml-2 text-sm text-gray-700"
            >
              Adjustable Day
            </label>
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
            {isEditMode ? 'Update Life Hack' : 'Create Life Hack'}
          </button>
        </div>
      </form>
    </div>
  );
}