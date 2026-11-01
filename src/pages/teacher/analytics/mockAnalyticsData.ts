/**
 * Mock Analytics Data for Student Assessment Attempts
 * 
 * Student name mappings:
 * - Alice Wong → Alice Johnson (strong student)
 * - Alex Carter → Bob Williams (weak student)
 * - Maya Singh → Charlie Brown (intermediate student)
 */

export interface AnalyticsData {
  attemptId: string;
  studentName: string;
  assessmentTitle: string;
  assessmentQuestion: string;
  meta: {
    promptCount: number;
    tokensIn: number;
    tokensOut: number;
    activeTimeMinutes: number;
    revisionCycles: number;
    confidence: string;
  };
  domainKnowledge: {
    composite: number;
    coverage: {
      score: number;
      detectedConcepts: string[];
      missingConcepts: string[];
    };
    depth: {
      score: number;
      namedEntitiesPer100Tokens: number;
      mechanismPrompts: number;
      conditionalReasoningPrompts: number;
      historiographyPrompts: number;
    };
    cognitiveComplexity: {
      score: number;
      distribution: {
        Recall: number;
        Explain: number;
        Analyze: number;
        Evaluate: number;
        Create: number;
      };
      higherOrderRatio: number;
    };
    disciplinaryReasoning: {
      score: number;
      causalFraming: boolean;
      extentWeighing: boolean;
      counterarguments: boolean;
      historiography: boolean;
      multiFactorAnalysis: boolean;
    };
  };
  aiUsage: {
    composite: number;
    taskFraming: {
      score: number;
      thesisRequested: boolean;
      explicitExtentFraming: boolean;
      alignmentToQuestion: boolean | string;
    };
    outputControl: {
      score: number;
      outlineFirst: boolean;
      paragraphSegmentation: boolean;
      styleConstraints: boolean | string;
      citationFormattingRequested: boolean;
    };
    iteration: {
      score: number;
      revisionCycles: number;
      critiqueLoop: boolean;
      increasingSpecificity: boolean | string;
    };
    verification: {
      score: number;
      counterargumentPrompt: boolean;
      accuracyCheck: boolean;
      sourceRequest: boolean;
    };
    integrityAlignment: {
      score: number;
      scaffoldingUsage: boolean | string;
      directSubstitutionPrompts: number;
      fabricationPrompts: number;
    };
  };
  summaryInsights: {
    strengths: string[];
    gaps: string[];
  };
}

// Strong student - Alice Johnson (was Alice Wong)
const aliceAnalytics: AnalyticsData = {
  attemptId: "ATT-2026-02-15-0001",
  studentName: "Alice Johnson",
  assessmentTitle: "Assessment 1 — Analytical Essay",
  assessmentQuestion: "To what extent was World War II caused by the Treaty of Versailles?",
  meta: {
    promptCount: 30,
    tokensIn: 5820,
    tokensOut: 9140,
    activeTimeMinutes: 74,
    revisionCycles: 3,
    confidence: "High"
  },
  domainKnowledge: {
    composite: 87,
    coverage: {
      score: 93,
      detectedConcepts: [
        "War guilt clause",
        "Reparations",
        "Hyperinflation",
        "Great Depression",
        "Nazi ideology",
        "Mussolini expansion",
        "Manchuria",
        "League of Nations failure",
        "Appeasement",
        "Rhineland",
        "Anschluss",
        "Munich Agreement",
        "Invasion of Poland",
        "Long vs short-term causes"
      ],
      missingConcepts: []
    },
    depth: {
      score: 82,
      namedEntitiesPer100Tokens: 7.1,
      mechanismPrompts: 8,
      conditionalReasoningPrompts: 3,
      historiographyPrompts: 1
    },
    cognitiveComplexity: {
      score: 86,
      distribution: {
        Recall: 4,
        Explain: 5,
        Analyze: 8,
        Evaluate: 7,
        Create: 6
      },
      higherOrderRatio: 0.70
    },
    disciplinaryReasoning: {
      score: 88,
      causalFraming: true,
      extentWeighing: true,
      counterarguments: true,
      historiography: true,
      multiFactorAnalysis: true
    }
  },
  aiUsage: {
    composite: 86,
    taskFraming: {
      score: 90,
      thesisRequested: true,
      explicitExtentFraming: true,
      alignmentToQuestion: true
    },
    outputControl: {
      score: 84,
      outlineFirst: true,
      paragraphSegmentation: true,
      styleConstraints: true,
      citationFormattingRequested: false
    },
    iteration: {
      score: 92,
      revisionCycles: 3,
      critiqueLoop: true,
      increasingSpecificity: true
    },
    verification: {
      score: 75,
      counterargumentPrompt: true,
      accuracyCheck: true,
      sourceRequest: false
    },
    integrityAlignment: {
      score: 85,
      scaffoldingUsage: true,
      directSubstitutionPrompts: 3,
      fabricationPrompts: 0
    }
  },
  summaryInsights: {
    strengths: [
      "Strong integration of core concepts",
      "High cognitive complexity across prompts",
      "Clear extent-based evaluation",
      "Structured iterative refinement",
      "Explicit critique and verification stage"
    ],
    gaps: [
      "No explicit citation formatting prompts",
      "Verification stage could request sources more explicitly"
    ]
  }
};

// Weak student - Bob Williams (was Alex Carter)
const bobAnalytics: AnalyticsData = {
  attemptId: "ATT-2026-02-15-0002",
  studentName: "Bob Williams",
  assessmentTitle: "Assessment 1 — Analytical Essay",
  assessmentQuestion: "To what extent was World War II caused by the Treaty of Versailles?",
  meta: {
    promptCount: 30,
    tokensIn: 2140,
    tokensOut: 7900,
    activeTimeMinutes: 22,
    revisionCycles: 0,
    confidence: "High"
  },
  domainKnowledge: {
    composite: 33,
    coverage: {
      score: 46,
      detectedConcepts: [
        "Treaty of Versailles",
        "Reparations",
        "Hitler",
        "Mussolini",
        "League of Nations",
        "Appeasement",
        "Invasion of Poland"
      ],
      missingConcepts: [
        "War guilt clause",
        "Hyperinflation",
        "Great Depression",
        "Manchuria",
        "Rhineland",
        "Anschluss",
        "Munich Agreement",
        "Long vs short-term causes",
        "Historiography"
      ]
    },
    depth: {
      score: 32,
      namedEntitiesPer100Tokens: 1.2,
      mechanismPrompts: 0,
      conditionalReasoningPrompts: 0,
      historiographyPrompts: 0
    },
    cognitiveComplexity: {
      score: 28,
      distribution: {
        Recall: 15,
        Explain: 6,
        Analyze: 2,
        Evaluate: 1,
        Create: 6
      },
      higherOrderRatio: 0.10
    },
    disciplinaryReasoning: {
      score: 24,
      causalFraming: true,
      extentWeighing: false,
      counterarguments: false,
      historiography: false,
      multiFactorAnalysis: false
    }
  },
  aiUsage: {
    composite: 31,
    taskFraming: {
      score: 35,
      thesisRequested: false,
      explicitExtentFraming: false,
      alignmentToQuestion: "weak"
    },
    outputControl: {
      score: 30,
      outlineFirst: false,
      paragraphSegmentation: false,
      styleConstraints: "minimal",
      citationFormattingRequested: false
    },
    iteration: {
      score: 40,
      revisionCycles: 0,
      critiqueLoop: false,
      increasingSpecificity: false
    },
    verification: {
      score: 15,
      counterargumentPrompt: false,
      accuracyCheck: false,
      sourceRequest: false
    },
    integrityAlignment: {
      score: 35,
      scaffoldingUsage: "low",
      directSubstitutionPrompts: 12,
      fabricationPrompts: 0
    }
  },
  summaryInsights: {
    strengths: [
      "Mentions several core entities"
    ],
    gaps: [
      "Superficial concept integration",
      "No mechanism-based reasoning",
      "No counterarguments or historiography",
      "Heavy direct substitution prompting",
      "No verification behaviour",
      "No structured planning"
    ]
  }
};

// Intermediate student - Charlie Brown (was Maya Singh)
const charlieAnalytics: AnalyticsData = {
  attemptId: "ATT-2026-02-15-0003",
  studentName: "Charlie Brown",
  assessmentTitle: "Assessment 1 — Analytical Essay",
  assessmentQuestion: "To what extent was World War II caused by the Treaty of Versailles?",
  meta: {
    promptCount: 22,
    tokensIn: 3410,
    tokensOut: 7200,
    activeTimeMinutes: 48,
    revisionCycles: 1,
    confidence: "Medium"
  },
  domainKnowledge: {
    composite: 63,
    coverage: {
      score: 71,
      detectedConcepts: [
        "Treaty of Versailles",
        "Reparations",
        "Hyperinflation",
        "Hitler",
        "Rhineland",
        "Anschluss",
        "League of Nations",
        "Appeasement",
        "Invasion of Poland"
      ],
      missingConcepts: [
        "War guilt clause",
        "Great Depression (detailed)",
        "Manchuria",
        "Munich Agreement (deep analysis)",
        "Historiography",
        "Long vs short-term structural framing"
      ]
    },
    depth: {
      score: 60,
      namedEntitiesPer100Tokens: 3.4,
      mechanismPrompts: 2,
      conditionalReasoningPrompts: 1,
      historiographyPrompts: 0
    },
    cognitiveComplexity: {
      score: 58,
      distribution: {
        Recall: 6,
        Explain: 7,
        Analyze: 4,
        Evaluate: 3,
        Create: 2
      },
      higherOrderRatio: 0.32
    },
    disciplinaryReasoning: {
      score: 62,
      causalFraming: true,
      extentWeighing: true,
      counterarguments: false,
      historiography: false,
      multiFactorAnalysis: true
    }
  },
  aiUsage: {
    composite: 59,
    taskFraming: {
      score: 65,
      thesisRequested: true,
      explicitExtentFraming: true,
      alignmentToQuestion: "moderate"
    },
    outputControl: {
      score: 60,
      outlineFirst: false,
      paragraphSegmentation: true,
      styleConstraints: "limited",
      citationFormattingRequested: false
    },
    iteration: {
      score: 55,
      revisionCycles: 1,
      critiqueLoop: false,
      increasingSpecificity: "moderate"
    },
    verification: {
      score: 40,
      counterargumentPrompt: false,
      accuracyCheck: false,
      sourceRequest: false
    },
    integrityAlignment: {
      score: 75,
      scaffoldingUsage: true,
      directSubstitutionPrompts: 4,
      fabricationPrompts: 0
    }
  },
  summaryInsights: {
    strengths: [
      "Moderate coverage of core events",
      "Basic extent evaluation present",
      "Clear paragraph-level structure"
    ],
    gaps: [
      "Limited depth and mechanism analysis",
      "Minimal verification behaviour",
      "No historiographical integration",
      "Limited refinement cycles"
    ]
  }
};

// Map by attemptId for easy lookup
export const analyticsDataByAttemptId: Record<string, AnalyticsData> = {
  "ATT-2026-02-15-0001": aliceAnalytics,
  "ATT-2026-02-15-0002": bobAnalytics,
  "ATT-2026-02-15-0003": charlieAnalytics,
};

/**
 * Map demo / seeded student ids or name fragments → sample analytics.
 * Seeded students: Alice Johnson (strong), Bob Williams (weak), Charlie Brown (mid).
 * Scores are illustrative — not computed from real AssessmentAttempt.state.
 */
export const analyticsDataByStudentKey: Record<string, AnalyticsData> = {
  alice: aliceAnalytics,
  'alice johnson': aliceAnalytics,
  'alice@wildmind.edu': aliceAnalytics,
  bob: bobAnalytics,
  'bob williams': bobAnalytics,
  'bob@wildmind.edu': bobAnalytics,
  charlie: charlieAnalytics,
  'charlie brown': charlieAnalytics,
  'charlie@wildmind.edu': charlieAnalytics,
};

/** Resolve sample analytics for a route studentId (cuid, email, or name fragment). */
export function getAnalyticsData(studentId?: string): AnalyticsData | null {
  if (!studentId) return aliceAnalytics;

  const key = studentId.trim().toLowerCase();
  if (analyticsDataByStudentKey[key]) return analyticsDataByStudentKey[key];

  for (const [fragment, data] of Object.entries(analyticsDataByStudentKey)) {
    if (key.includes(fragment) || fragment.includes(key)) return data;
  }

  // Stable fallback so the same id always shows the same sample student
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const students = [aliceAnalytics, bobAnalytics, charlieAnalytics];
  return students[hash % 3];
}

export { aliceAnalytics, bobAnalytics, charlieAnalytics };
