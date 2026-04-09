// Shared schemas across client and server
// These match the expected outputs from the AI MCP tools

export const AnalyzeResultSchema = {
    viability_score: "number (0-100)",
    risks: "array of strings",
    competition: "string",
    uniqueness: "string",
    summary: "string"
};

export const BreakResultSchema = {
    failure_reasons: "array of strings",
    wrong_assumptions: "array of strings",
    edge_cases: "array of strings"
};

export const ImproveResultSchema = {
    improved_version: "string",
    niche: "string",
    monetization: "string",
    roadmap: "array of strings"
};

export const RoastResultSchema = {
    roast: "string"
};
