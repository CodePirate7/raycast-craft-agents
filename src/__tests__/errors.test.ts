import { describe, expect, it } from "vitest";
import { AppError, ErrorCode, isAppError } from "../lib/errors";

describe("AppError", () => {
  it("preserves code and message", () => {
    const err = new AppError(ErrorCode.VALIDATION_ERROR, "bad input");
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.message).toBe("bad input");
  });

  it("passes instanceof Error and AppError", () => {
    const err = AppError.validation("x");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it("isAppError guard", () => {
    expect(isAppError(AppError.internal())).toBe(true);
    expect(isAppError(new Error("generic"))).toBe(false);
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });

  it("static factories set the right codes", () => {
    expect(AppError.validation("x").code).toBe("VALIDATION_ERROR");
    expect(AppError.internal().code).toBe("INTERNAL_ERROR");
    expect(AppError.parse(ErrorCode.SESSION_PARSE_FAILED, "x").code).toBe("SESSION_PARSE_FAILED");
  });

  it("toJSON serializes cleanly", () => {
    const err = new AppError(ErrorCode.INTERNAL_ERROR, "msg", { hint: 1 });
    const json = err.toJSON();
    expect(json.name).toBe("AppError");
    expect(json.message).toBe("msg");
    expect(json.details).toEqual({ hint: 1 });
  });
});
