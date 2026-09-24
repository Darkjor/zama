import { describe, expect, it } from "vitest";
import { formatMXNCompact } from "./format";

describe("formatMXNCompact", () => {
  it("abrevia el precio de entrada a una cifra decimal", () => {
    expect(formatMXNCompact(1601405, "es")).toMatch(/^\$1\.6\s?M$/);
    expect(formatMXNCompact(1601405, "en")).toBe("$1.6M");
  });
});
