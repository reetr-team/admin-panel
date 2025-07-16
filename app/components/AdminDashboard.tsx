"use client";

import { useState } from "react";

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
  MONDAY = "Mon",
  TUESDAY = "Tue",
  WEDNESDAY = "Wed",
  THURSDAY = "Thu",
  FRIDAY = "Fri",
  SATURDAY = "Sat",
  SUNDAY = "Sun",
}

interface AdminDashboardProps {
  user: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("lifehacks");
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    category: LifeHackCategory.FAITH,
    icon: "",
    isDaily: false,
    adjustableTime: false,
    adjustableDay: false,
    defaultDay: Day.MONDAY,
    defaultTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.type || !formData.description) {
      alert("Please fill in required fields");
      return;
    }

    try {
      // For now, just show success - would integrate with API later
      alert("Life hack created successfully!");

      // Reset form
      setFormData({
        type: "",
        description: "",
        category: LifeHackCategory.FAITH,
        icon: "",
        isDaily: false,
        adjustableTime: false,
        adjustableDay: false,
        defaultDay: Day.MONDAY,
        defaultTime: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating life hack");
    }
  };

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
              onClick={() => setActiveTab("lifehacks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "lifehacks"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Life Hacks
            </button>
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
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "lifehacks" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Create New Life Hack
            </h2>

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
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Icon name or URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Time
                  </label>
                  <input
                    type="time"
                    value={formData.defaultTime}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
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
                        {day}
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
                  <label
                    htmlFor="isDaily"
                    className="ml-2 text-sm text-gray-700"
                  >
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  Create Life Hack
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Assessments
            </h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
