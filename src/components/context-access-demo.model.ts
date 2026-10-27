export type ContextAccessMode = "without" | "with";
export type ContextAccessStage = "idle" | "searching" | "found" | "answered";

export type ContextAccessState = {
  mode: ContextAccessMode;
  stage: ContextAccessStage;
};

export const initialContextAccessState: ContextAccessState = {
  mode: "without",
  stage: "idle",
};

export function selectMode(mode: ContextAccessMode): ContextAccessState {
  return { mode, stage: "idle" };
}

export function advanceContextAccess(
  state: ContextAccessState,
): ContextAccessState {
  if (state.mode === "without") return { mode: "without", stage: "answered" };
  if (state.stage === "idle") return { mode: "with", stage: "searching" };
  if (state.stage === "searching") return { mode: "with", stage: "found" };
  return { mode: "with", stage: "answered" };
}
