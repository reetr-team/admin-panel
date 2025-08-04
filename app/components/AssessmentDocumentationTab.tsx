"use client";

export default function AssessmentDocumentationTab() {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        TypeScript Interface Documentation
      </h3>

      <div className="space-y-6">
        {/* Assessment Form Data Interface - MOST IMPORTANT */}
        <div className="border border-green-300 rounded-lg overflow-hidden shadow-md">
          <div className="bg-green-100 px-4 py-3 border-b border-green-200">
            <h4 className="text-md font-semibold text-green-900">
              AssessmentFormData
            </h4>
            <p className="text-sm text-green-700 mt-1">
              <strong>PRIMARY INTERFACE:</strong> Used for creating new
              assessments via POST requests. ID should be generated on the
              backend (1, 2, 3, etc.)
            </p>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-50 rounded p-3 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-blue-600">id</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">title</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">description</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">estimatedTime</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">stages</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-purple-600">AssessmentStage[]</span>
                </div>
                <div>
                  <span className="text-blue-600">assessmentCTA</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-purple-600">AssessmentCTA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Stage Interface */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
            <h4 className="text-md font-semibold text-green-900">
              AssessmentStage
            </h4>
            <p className="text-sm text-green-700 mt-1">Stage structure</p>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-50 rounded p-3 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-blue-600">id</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">title</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">questions</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-purple-600">AssessmentQuestion[]</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Question Interface */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
            <h4 className="text-md font-semibold text-blue-900">
              AssessmentQuestion
            </h4>
            <p className="text-sm text-blue-700 mt-1">Question structure</p>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-50 rounded p-3 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-blue-600">id</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">questionText</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">inputType</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-purple-600">
                    &quot;radio&quot; | &quot;slider&quot; | &quot;text&quot; |
                    &quot;textarea&quot; | &quot;multiselect&quot;
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">options</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string[]</span>
                </div>
                <div>
                  <span className="text-blue-600">sliderMin</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">sliderMax</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">sliderLabels</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-gray-700">{"{"}</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600">minLabel</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600">maxLabel</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-gray-700">{"}"}</span>
                </div>
                <div>
                  <span className="text-blue-600">placeholder</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">maxSelections</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div>
                  <span className="text-blue-600">required</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">boolean</span>
                </div>
                <div>
                  <span className="text-blue-600">conditionalLogic</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-gray-700">{"{"}</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600">dependsOnStageId</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600">dependsOnQuestionId</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">number</span>
                </div>
                <div className="ml-4">
                  <span className="text-blue-600">showWhenValueIn</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string[]</span>
                </div>
                <div>
                  <span className="text-gray-700">{"}"}</span>
                </div>
                <div>
                  <span className="text-blue-600">finalQuestion</span>
                  <span className="text-orange-500">?</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">boolean</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment CTA Interface */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
            <h4 className="text-md font-semibold text-purple-900">
              AssessmentCTA
            </h4>
            <p className="text-sm text-purple-700 mt-1">
              Defines the call-to-action button configuration after assessment
              completion
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
              <p className="text-xs text-red-800 font-medium">
                ⚠️ IMPORTANT: While this CTA is added during assessment
                creation, this object will only be used in the assessment
                complete POST request and must be added accordingly on the
                backend.
              </p>
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-50 rounded p-3 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-blue-600">buttonText</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">webRoute</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
                <div>
                  <span className="text-blue-600">nativeRoute</span>
                  <span className="text-gray-500">:</span>{" "}
                  <span className="text-green-600">string</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Example Response */}
        <div className="border border-orange-300 rounded-lg overflow-hidden shadow-md">
          <div className="bg-orange-100 px-4 py-3 border-b border-orange-200">
            <h4 className="text-md font-semibold text-orange-900">
              Complete Assessment Response Example
            </h4>
            <p className="text-sm text-orange-700 mt-1">
              <strong>FULL EXAMPLE:</strong> What the complete assessment object
              looks like with real data
            </p>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-900 rounded p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-xs whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    title: "Discovery Assessment",
                    description:
                      "Help us understand your current life situation to provide personalized guidance.",
                    estimatedTime: 15,
                    stages: [
                      {
                        id: 1,
                        title: "Relationship Status",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "What best describes your current relationship status?",
                            inputType: "radio",
                            options: [
                              "Married",
                              "Engaged",
                              "Dating",
                              "Single",
                              "Divorced",
                              "Widowed",
                            ],
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
                            conditionalLogic: {
                              dependsOnStageId: 1,
                              dependsOnQuestionId: 1,
                              showWhenValueIn: [
                                "Married",
                                "Divorced",
                                "Widowed",
                              ],
                            },
                          },
                        ],
                      },
                      {
                        id: 3,
                        title: "Work",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "What's your current role or job title?",
                            inputType: "text",
                            required: true,
                          },
                          {
                            id: 2,
                            questionText:
                              "How clear are you on your purpose at work?",
                            inputType: "slider",
                            required: true,
                            sliderMin: 0,
                            sliderMax: 10,
                            sliderLabels: {
                              minLabel: "Totally Lost",
                              maxLabel: "Totally Clear",
                            },
                          },
                        ],
                      },
                      {
                        id: 4,
                        title: "Mental & Emotional Well Being",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "How would you rate your mental and emotional well-being right now?",
                            inputType: "slider",
                            required: true,
                            sliderMin: 0,
                            sliderMax: 10,
                            sliderLabels: {
                              minLabel: "Overwhelmed",
                              maxLabel: "Grounded and Resilient",
                            },
                          },
                        ],
                      },
                      {
                        id: 5,
                        title: "Describe Yourself",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "What are 5 words that your closest friends would use to describe you?",
                            inputType: "textarea",
                            required: true,
                            placeholder:
                              "e.g., compassionate, creative, analytical, energetic, loyal",
                          },
                          {
                            id: 2,
                            questionText:
                              "Include any personality or spiritual growth tools you've used (optional)",
                            inputType: "textarea",
                            required: false,
                            placeholder:
                              "e.g., Enneagram Type 4, StrengthsFinder: Strategic, Culture Index: Analyzer, MBTI: INFP, etc.",
                          },
                        ],
                      },
                      {
                        id: 6,
                        title: "Faith, Focus, and Priorities",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "Do you consider faith or spirituality an important part of your life?",
                            inputType: "radio",
                            options: [
                              "Yes – actively growing",
                              "Yes – but not consistent",
                              "No – not important to me",
                              "Prefer not to say",
                            ],
                            required: true,
                          },
                          {
                            id: 2,
                            questionText:
                              "What are the top 3 areas of life you want to grow in right now?",
                            inputType: "multiselect",
                            options: [
                              "Faith / Spiritual Life",
                              "Marriage / Romantic Relationship",
                              "Parenting",
                              "Friendships / Community",
                              "Career / Business",
                              "Fitness & Health",
                              "Finances & Stewardship",
                              "Rest / Rhythm / Discipline",
                              "Purpose & Calling",
                              "Emotional / Mental Health",
                            ],
                            required: true,
                            maxSelections: 3,
                          },
                        ],
                      },
                      {
                        id: 7,
                        title: "Readiness & Coaching Style",
                        questions: [
                          {
                            id: 1,
                            questionText:
                              "How would you describe your current season of life?",
                            inputType: "radio",
                            options: [
                              "Building / Growing",
                              "Surviving / Under pressure",
                              "Healing / Rebuilding",
                              "Exploring / Reorienting",
                            ],
                            required: true,
                          },
                          {
                            id: 2,
                            questionText:
                              "Which kind of coaching do you prefer?",
                            inputType: "radio",
                            options: [
                              "Gentle and reflective",
                              "Bold and challenging",
                              "Structured and goal-driven",
                              "A mix of all three",
                            ],
                            required: true,
                            finalQuestion: true,
                          },
                        ],
                      },
                    ],
                    assessmentCTA: {
                      buttonText: "Meet Your Coach",
                      webRoute: "/coach",
                      nativeRoute: "/(tabs)/coach",
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Assessment Results Response */}
        <div className="border border-red-300 rounded-lg overflow-hidden shadow-md">
          <div className="bg-red-100 px-4 py-3 border-b border-red-200">
            <h4 className="text-md font-semibold text-red-900">
              Assessment Results Response Structure
            </h4>
            <p className="text-sm text-red-700 mt-1">
              <strong>RESULTS ENDPOINT:</strong> What the assessment
              completion/results response should look like (already implemented)
            </p>
          </div>
          <div className="bg-white p-4">
            <div className="bg-gray-900 rounded p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-xs whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    success: true,
                    message: "Assessment completed and summary generated",
                    data: {
                      assessmentId: 1,
                      userId: 1,
                      assessmentType: "Initial Assessment",
                      completedAt: "2025-07-02T03:22:12.680341",
                      headerText: "You're all set.",
                      subtitleText:
                        "Based on your responses, here's a little snippet into you as an individual.",
                      summary: {
                        "// NOTE":
                          "Will vary based on assessment; should only return objects ({}) or arrays ([])",
                      },
                      assessmentCTA: {
                        buttonText: "Meet Your Coach",
                        webRoute: "/coach",
                        nativeRoute: "/(tabs)/coach",
                      },
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> The{" "}
                <code className="bg-yellow-200 px-1 rounded">summary</code>{" "}
                object structure will vary based on the specific assessment
                type. It should only contain objects ({"{}"}) or arrays ([]) as
                values, not primitive strings or numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
