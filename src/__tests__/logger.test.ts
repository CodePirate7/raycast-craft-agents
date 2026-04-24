import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "../lib/logger";

describe("logger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    errSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errSpy.mockRestore();
    delete process.env.LOG_LEVEL;
  });

  it("emits one JSON line to stdout for info", () => {
    logger.info("test.event", { a: 1 });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const line = logSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed.level).toBe("info");
    expect(parsed.event).toBe("test.event");
    expect(parsed.a).toBe(1);
    expect(typeof parsed.ts).toBe("string");
  });

  it("emits to stderr for error and serializes Error objects", () => {
    const err = new Error("boom");
    logger.error("failed", err, { ctx: "x" });
    expect(errSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(errSpy.mock.calls[0][0] as string);
    expect(parsed.level).toBe("error");
    expect(parsed.ctx).toBe("x");
    expect(parsed.error.name).toBe("Error");
    expect(parsed.error.message).toBe("boom");
    expect(typeof parsed.error.stack).toBe("string");
  });

  it("silences debug unless LOG_LEVEL=debug", () => {
    logger.debug("silent", { a: 1 });
    expect(logSpy).not.toHaveBeenCalled();
    process.env.LOG_LEVEL = "debug";
    logger.debug("loud", { b: 2 });
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
