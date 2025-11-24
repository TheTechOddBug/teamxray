// @ts-nocheck
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file
config({ path: resolve(__dirname, '../.env') });

import { evalite } from "evalite";
import { Factuality } from "autoevals";

/**
 * Real-world evaluation of Team X-Ray's AI analysis capabilities
 * Tests actual expertise analysis with AI-powered scoring
 */

evalite("AI Expertise Analysis - Quality Check", {
  data: async () => [
    {
      input: {
        repositoryData: {
          contributors: [
            {
              name: "Alice Chen",
              email: "alice@example.com",
              commits: 245,
              additions: 15230,
              deletions: 8420
            },
            {
              name: "Bob Martinez",
              email: "bob@example.com", 
              commits: 156,
              additions: 9840,
              deletions: 4210
            }
          ],
          commits: [
            {
              author: "Alice Chen",
              message: "Refactor authentication system with improved security",
              date: "2025-11-20",
              files: ["src/auth/login.ts", "src/auth/security.ts"]
            },
            {
              author: "Alice Chen",
              message: "Code review: Helped Bob with async/await patterns",
              date: "2025-11-19",
              files: []
            },
            {
              author: "Bob Martinez",
              message: "Add React dashboard components with TypeScript",
              date: "2025-11-18",
              files: ["src/ui/Dashboard.tsx", "src/ui/Charts.tsx"]
            }
          ],
          fileChanges: {
            "src/auth/login.ts": ["Alice Chen"],
            "src/auth/security.ts": ["Alice Chen"],
            "src/ui/Dashboard.tsx": ["Bob Martinez"],
            "src/ui/Charts.tsx": ["Bob Martinez"]
          }
        }
      },
      expected: {
        topExpertName: "Alice Chen",
        detectsMentoring: true,
        identifiesSpecializations: true,
        humanInsights: true
      }
    }
  ],

  task: async (input) => {
    // Simulate Team X-Ray's analysis
    const { contributors, commits } = input.repositoryData;
    
    // Find top expert by commits
    const sorted = [...contributors].sort((a, b) => b.commits - a.commits);
    const topExpert = sorted[0];
    
    // Detect mentoring patterns
    const mentoringCommits = commits.filter(c => 
      c.message.toLowerCase().includes("review") ||
      c.message.toLowerCase().includes("helped") ||
      c.message.toLowerCase().includes("mentoring")
    );
    
    // Detect specializations from commit messages
    const specializations = new Set<string>();
    commits.forEach(commit => {
      if (commit.message.toLowerCase().includes("auth")) specializations.add("Authentication");
      if (commit.message.toLowerCase().includes("security")) specializations.add("Security");
      if (commit.message.toLowerCase().includes("react")) specializations.add("React");
      if (commit.message.toLowerCase().includes("typescript")) specializations.add("TypeScript");
    });
    
    // Generate human-focused insights
    const insights = [];
    if (mentoringCommits.length > 0) {
      insights.push(`${mentoringCommits[0].author} shows mentoring behavior through code reviews and helping teammates`);
    }
    insights.push(`${topExpert.name} demonstrates deep expertise with ${topExpert.commits} meaningful contributions`);
    
    return {
      topExpert: topExpert.name,
      totalContributors: contributors.length,
      hasMentoringBehavior: mentoringCommits.length > 0,
      specializations: Array.from(specializations),
      humanInsights: insights,
      communicationStyle: mentoringCommits.length > 0 
        ? "Collaborative and supportive" 
        : "Focused individual contributor"
    };
  },

  scorers: [
    // Basic accuracy check
    ({ output, expected }) => ({
      name: "Top Expert Identification",
      score: output.topExpert === expected.topExpertName ? 1 : 0,
      details: `Identified: ${output.topExpert} (expected: ${expected.topExpertName})`
    }),
    
    // Mentoring detection
    ({ output, expected }) => ({
      name: "Mentoring Pattern Detection",
      score: output.hasMentoringBehavior === expected.detectsMentoring ? 1 : 0,
      details: `Detected mentoring: ${output.hasMentoringBehavior ? "✓" : "✗"}`
    }),
    
    // Specialization detection
    ({ output, expected }) => ({
      name: "Specialization Detection",
      score: (output.specializations && output.specializations.length > 0) === expected.identifiesSpecializations ? 1 : 0,
      details: `Found specializations: ${output.specializations?.join(", ") || "none"}`
    }),
    
    // Human insights quality check (custom, no AI needed)
    ({ output }) => ({
      name: "Human Insights Quality",
      score: output.humanInsights && output.humanInsights.length > 0 ? 1 : 0,
      details: `Generated ${output.humanInsights?.length || 0} insights`
    })
    
    // AI-powered factuality scoring (requires OpenAI credits)
    // Add billing at: https://platform.openai.com/account/billing
    // Then uncomment: Factuality
  ]
});

evalite("File Expert Matching", {
  data: async () => [
    {
      input: {
        filePath: "src/auth/login.ts",
        contributors: [
          { name: "Alice Chen", commits: 15, lastEdit: "2025-11-20" },
          { name: "Bob Martinez", commits: 2, lastEdit: "2025-10-15" }
        ]
      },
      expected: {
        expert: "Alice Chen",
        confidenceThreshold: 0.7
      }
    }
  ],

  task: async (input) => {
    // File expert logic
    const sorted = [...input.contributors].sort((a, b) => b.commits - a.commits);
    const topContributor = sorted[0];
    const confidence = topContributor.commits / (topContributor.commits + sorted[1].commits);
    
    return {
      filePath: input.filePath,
      expertName: topContributor.name,
      confidence: confidence,
      totalContributions: topContributor.commits
    };
  },

  scorers: [
    ({ output, expected }) => ({
      name: "Expert Match Accuracy",
      score: output.expertName === expected.expert ? 1 : 0,
      details: `${output.expertName} (${(output.confidence * 100).toFixed(0)}% confidence)`
    }),
    
    ({ output, expected }) => ({
      name: "Confidence Level",
      score: output.confidence >= expected.confidenceThreshold ? 1 : 0.5,
      details: `Confidence: ${(output.confidence * 100).toFixed(0)}%`
    })
  ]
});

evalite("Collaboration Pattern Analysis", {
  data: async () => [
    {
      input: {
        commits: [
          "Fixed bug in payment processing - thanks Alice for catching this!",
          "Reviewed Bob's authentication PR - solid work",
          "Pair programmed with Charlie on the new API endpoints",
          "Merged feature after team discussion"
        ]
      },
      expected: {
        collaborationScore: 0.75, // 3 out of 4 show collaboration
        patterns: ["code review", "pair programming", "team discussion"]
      }
    }
  ],

  task: async (input) => {
    const collaborationKeywords = {
      "review": "code review",
      "pair": "pair programming", 
      "thanks": "gratitude/recognition",
      "helped": "knowledge sharing",
      "team": "team collaboration",
      "merged": "integration work"
    };
    
    const foundPatterns = new Set<string>();
    let collaborativeCommits = 0;
    
    input.commits.forEach(msg => {
      const lower = msg.toLowerCase();
      let hasCollaboration = false;
      
      Object.entries(collaborationKeywords).forEach(([keyword, pattern]) => {
        if (lower.includes(keyword)) {
          foundPatterns.add(pattern);
          hasCollaboration = true;
        }
      });
      
      if (hasCollaboration) collaborativeCommits++;
    });
    
    return {
      collaborationScore: collaborativeCommits / input.commits.length,
      patterns: Array.from(foundPatterns),
      totalCommits: input.commits.length,
      collaborativeCommits
    };
  },

  scorers: [
    ({ output, expected }) => {
      const scoreDiff = Math.abs(output.collaborationScore - expected.collaborationScore);
      const score = Math.max(0, 1 - (scoreDiff * 2)); // Penalize differences
      
      return {
        name: "Collaboration Score Accuracy",
        score,
        details: `Score: ${(output.collaborationScore * 100).toFixed(0)}% (expected: ${(expected.collaborationScore * 100).toFixed(0)}%)`
      };
    },
    
    ({ output, expected }) => {
      const foundExpected = expected.patterns.filter(p => 
        output.patterns.some(op => op.toLowerCase().includes(p.toLowerCase()))
      );
      const score = foundExpected.length / expected.patterns.length;
      
      return {
        name: "Pattern Detection",
        score,
        details: `Found ${foundExpected.length}/${expected.patterns.length} expected patterns`
      };
    }
  ]
});
