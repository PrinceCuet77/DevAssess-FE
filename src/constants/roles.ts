// 1. Single source of truth (Read-only array)
export const ROLES = ['DEVELOPER', 'EVALUATOR'] as const;

// 2. Extract the TypeScript type ("DEVELOPER" | "EVALUATOR")
export type Role = (typeof ROLES)[number];
