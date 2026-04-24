import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AppError } from "../lib/errors";
import { resolveWorkspacePath, sessionsDir, sourcesDir, workspaceSkillsDir } from "../lib/workspace";

describe("resolveWorkspacePath", () => {
  it("expands a leading ~", () => {
    const resolved = resolveWorkspacePath("~/foo/bar");
    expect(resolved).toBe(path.join(os.homedir(), "foo", "bar"));
  });

  it("leaves absolute paths alone", () => {
    expect(resolveWorkspacePath("/tmp/ws")).toBe("/tmp/ws");
  });

  it("throws for empty / nullish input", () => {
    expect(() => resolveWorkspacePath(undefined)).toThrow(AppError);
    expect(() => resolveWorkspacePath("")).toThrow(AppError);
    expect(() => resolveWorkspacePath("   ")).toThrow(AppError);
  });

  it("resolves relative paths against cwd", () => {
    const r = resolveWorkspacePath("./subdir");
    expect(path.isAbsolute(r)).toBe(true);
  });
});

describe("subdir helpers", () => {
  it("sessionsDir appends sessions/", () => {
    expect(sessionsDir("/tmp/ws")).toBe(path.join("/tmp/ws", "sessions"));
  });
  it("sourcesDir appends sources/", () => {
    expect(sourcesDir("/tmp/ws")).toBe(path.join("/tmp/ws", "sources"));
  });
  it("workspaceSkillsDir appends skills/", () => {
    expect(workspaceSkillsDir("/tmp/ws")).toBe(path.join("/tmp/ws", "skills"));
  });
});
