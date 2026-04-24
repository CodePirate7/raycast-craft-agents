import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { listSessions } from "../lib/sessions";

function makeWorkspace(): string {
  const ws = fs.mkdtempSync(path.join(os.tmpdir(), "rca-test-"));
  fs.mkdirSync(path.join(ws, "sessions"));
  return ws;
}

function writeSession(ws: string, id: string, firstLine: string | null): void {
  const dir = path.join(ws, "sessions", id);
  fs.mkdirSync(dir, { recursive: true });
  if (firstLine !== null) {
    fs.writeFileSync(path.join(dir, "session.jsonl"), firstLine + "\n");
  }
}

describe("listSessions", () => {
  let ws: string;

  beforeEach(() => {
    ws = makeWorkspace();
  });

  afterEach(() => {
    fs.rmSync(ws, { recursive: true, force: true });
  });

  it("returns empty for missing sessions dir", () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), "rca-empty-"));
    expect(listSessions(empty)).toEqual([]);
    fs.rmSync(empty, { recursive: true, force: true });
  });

  it("reads one valid session", () => {
    writeSession(
      ws,
      "260424-clever-pearl",
      JSON.stringify({
        sessionId: "260424-clever-pearl",
        name: "Plan day",
        labels: ["focus"],
        flagged: true,
        updatedAt: "2026-04-24T10:00:00Z",
      }),
    );
    const records = listSessions(ws);
    expect(records).toHaveLength(1);
    const [r] = records;
    expect(r.id).toBe("260424-clever-pearl");
    expect(r.displayName).toBe("Plan day");
    expect(r.labels).toEqual(["focus"]);
    expect(r.flagged).toBe(true);
  });

  it("falls back to folder id for malformed JSON", () => {
    writeSession(ws, "broken-1", "not-json-at-all");
    const [r] = listSessions(ws);
    expect(r.id).toBe("broken-1");
    expect(r.displayName).toBe("broken-1");
    expect(r.flagged).toBe(false);
  });

  it("falls back when session.jsonl is missing", () => {
    writeSession(ws, "no-jsonl", null);
    const [r] = listSessions(ws);
    expect(r.id).toBe("no-jsonl");
    expect(r.displayName).toBe("no-jsonl");
  });

  it("skips files at the sessions root (only directories count)", () => {
    fs.writeFileSync(path.join(ws, "sessions", "stray.txt"), "not a session");
    writeSession(ws, "real", JSON.stringify({ name: "Real" }));
    const records = listSessions(ws);
    expect(records).toHaveLength(1);
    expect(records[0].id).toBe("real");
  });

  it("sorts by updatedAt desc; older last", () => {
    writeSession(ws, "old", JSON.stringify({ name: "Old", updatedAt: "2026-01-01T00:00:00Z" }));
    writeSession(ws, "new", JSON.stringify({ name: "New", updatedAt: "2026-04-24T00:00:00Z" }));
    const records = listSessions(ws);
    expect(records.map((r) => r.id)).toEqual(["new", "old"]);
  });

  it("handles unicode name / emoji safely", () => {
    writeSession(ws, "u-1", JSON.stringify({ name: "规划今日 🎯" }));
    const [r] = listSessions(ws);
    expect(r.displayName).toBe("规划今日 🎯");
  });
});
