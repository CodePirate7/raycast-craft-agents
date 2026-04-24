import { describe, expect, it } from "vitest";
import {
  buildAction,
  buildCompound,
  buildNewChat,
  buildNewSession,
  buildSessionLink,
  buildSkillLink,
  buildSourceLink,
} from "../lib/deeplink";
import { AppError } from "../lib/errors";

describe("buildNewSession", () => {
  it("returns a bare URL when no params given", () => {
    expect(buildNewSession()).toBe("craftagents://action/new-session");
  });

  it("includes window=focused", () => {
    expect(buildNewSession({ window: "focused" })).toBe("craftagents://action/new-session?window=focused");
  });

  it("URL-encodes input with spaces and Chinese", () => {
    const url = buildNewSession({ input: "你好 世界", send: true, window: "focused" });
    expect(url).toContain("input=%E4%BD%A0%E5%A5%BD%20%E4%B8%96%E7%95%8C");
    expect(url).toContain("send=true");
    expect(url).toContain("window=focused");
  });

  it("URL-encodes emoji", () => {
    const url = buildNewSession({ input: "🎯 test" });
    expect(url).toContain("input=%F0%9F%8E%AF%20test");
  });

  it("URL-encodes double quotes and newlines", () => {
    const url = buildNewSession({ input: 'say "hi"\nlinebreak' });
    expect(url).toContain("%22");
    expect(url).toContain("%0A");
  });

  it("serializes badges as JSON", () => {
    const url = buildNewSession({ badges: [{ kind: "file", path: "/x" }] });
    expect(url).toContain("badges=");
    expect(decodeURIComponent(url.split("badges=")[1])).toBe('[{"kind":"file","path":"/x"}]');
  });

  it("rejects invalid permission mode with AppError", () => {
    expect(() =>
      // @ts-expect-error intentional wrong value
      buildNewSession({ mode: "wrong" }),
    ).toThrow(AppError);
  });

  it("allows all valid permission modes", () => {
    const modes = ["plan", "acceptEdits", "bypassPermissions", "default"] as const;
    for (const m of modes) {
      expect(buildNewSession({ mode: m })).toContain(`mode=${m}`);
    }
  });
});

describe("buildNewChat", () => {
  it("produces a minimal URL", () => {
    expect(buildNewChat()).toBe("craftagents://action/new-chat");
  });
  it("encodes input + send", () => {
    const url = buildNewChat({ input: "hi", send: true, window: "focused" });
    expect(url).toBe("craftagents://action/new-chat?input=hi&send=true&window=focused");
  });
});

describe("buildAction", () => {
  it("builds flag-session with id", () => {
    expect(buildAction("flag-session", "abc-123")).toBe("craftagents://action/flag-session/abc-123");
  });

  it("throws for actions that require id when id is missing", () => {
    expect(() => buildAction("delete-session")).toThrow(AppError);
    expect(() => buildAction("oauth", "")).toThrow(AppError);
  });

  it("allows actions that don't require id", () => {
    expect(buildAction("set-mode")).toBe("craftagents://action/set-mode");
    expect(buildAction("copy")).toBe("craftagents://action/copy");
  });

  it("encodes special chars in id", () => {
    expect(buildAction("rename-session", "a b/c")).toBe("craftagents://action/rename-session/a%20b%2Fc");
  });
});

describe("buildCompound", () => {
  it("builds bare host", () => {
    expect(buildCompound("allSessions")).toBe("craftagents://allSessions");
  });

  it("appends path segments", () => {
    expect(buildCompound("allSessions", ["session", "abc"])).toBe("craftagents://allSessions/session/abc");
  });

  it("encodes segments with slashes", () => {
    expect(buildCompound("sources", ["source", "my/src"])).toBe("craftagents://sources/source/my%2Fsrc");
  });

  it("appends window query param", () => {
    expect(buildCompound("flagged", [], "full")).toBe("craftagents://flagged?window=full");
  });

  it("skips empty segments", () => {
    expect(buildCompound("allSessions", ["", "session", ""])).toBe("craftagents://allSessions/session");
  });
});

describe("buildSessionLink / buildSourceLink / buildSkillLink", () => {
  it("builds a session link", () => {
    expect(buildSessionLink("260424-clever-pearl")).toBe(
      "craftagents://allSessions/session/260424-clever-pearl",
    );
  });

  it("rejects empty id", () => {
    expect(() => buildSessionLink("")).toThrow(AppError);
    expect(() => buildSourceLink("")).toThrow(AppError);
    expect(() => buildSkillLink("")).toThrow(AppError);
  });

  it("builds source and skill links", () => {
    expect(buildSourceLink("github")).toBe("craftagents://sources/source/github");
    expect(buildSkillLink("my-skill")).toBe("craftagents://skills/skill/my-skill");
  });
});
