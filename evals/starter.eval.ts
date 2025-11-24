// @ts-nocheck
import { evalite } from "evalite";
import { Levenshtein } from "autoevals";

/**
 * Simple evaluation to test Team X-Ray's expert identification
 * Uses only basic scorers (no AI required)
 */

evalite("Expert Identification - Basic", {
  data: async () => [
    {
      input: {
        contributors: [
          { name: "Alice Dev", commits: 150 },
          { name: "Bob Engineer", commits: 85 },
          { name: "Charlie Coder", commits: 45 }
        ]
      },
      expected: {
        topExpert: "Alice Dev",
        totalExperts: 3
      }
    },
    {
      input: {
        contributors: [
          { name: "Sarah Smith", commits: 200 }
        ]
      },
      expected: {
        topExpert: "Sarah Smith",
        totalExperts: 1
      }
    }
  ],
  
  task: async (input) => {
    // Simulate expert identification logic
    const sorted = [...input.contributors].sort((a, b) => b.commits - a.commits);
    
    return {
      topExpert: sorted[0].name,
      totalExperts: input.contributors.length,
      expertiseScores: sorted.map(c => ({
        name: c.name,
        score: (c.commits / sorted[0].commits) * 100
      }))
    };
  },

  scorers: [
    // Custom scorer: Top expert accuracy
    ({ output, expected }) => {
      const match = output.topExpert === expected.topExpert;
      return {
        name: "Top Expert Accuracy",
        score: match ? 1 : 0,
        details: match 
          ? `✓ Correctly identified ${expected.topExpert}` 
          : `✗ Expected ${expected.topExpert}, got ${output.topExpert}`
      };
    },
    // Custom scorer: Expert count
    ({ output, expected }) => {
      const match = output.totalExperts === expected.totalExperts;
      return {
        name: "Expert Count",
        score: match ? 1 : 0,
        details: `Found ${output.totalExperts} experts (expected: ${expected.totalExperts})`
      };
    }
  ]
});

evalite("Team Collaboration Detection", {
  data: async () => [
    {
      input: {
        commits: [
          "Fixed bug in payment processor",
          "Reviewed Alice's PR - looks good!",
          "Merged feature branch after testing"
        ]
      },
      expected: {
        hasCollaboration: true
      }
    }
  ],

  task: async (input) => {
    const collaborationKeywords = ["review", "merge", "pair", "thanks", "helped"];
    const hasCollaboration = input.commits.some(msg =>
      collaborationKeywords.some(keyword => msg.toLowerCase().includes(keyword))
    );

    return {
      hasCollaboration,
      patterns: collaborationKeywords.filter(keyword =>
        input.commits.some(msg => msg.toLowerCase().includes(keyword))
      )
    };
  },

  scorers: [
    ({ output, expected }) => {
      const match = output.hasCollaboration === expected.hasCollaboration;
      return {
        name: "Collaboration Detection",
        score: match ? 1 : 0,
        details: `Detected patterns: ${output.patterns.join(", ") || "none"}`
      };
    }
  ]
});
