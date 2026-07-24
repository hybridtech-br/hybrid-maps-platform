import { describe, expect, it } from "vitest";
import { SelectionStore } from "../src/SelectionStore.js";

describe("SelectionStore", () => {
  it("selects and checks features", () => {
    const selection = new SelectionStore();

    selection.select("feature-1");

    expect(selection.isSelected("feature-1")).toBe(true);
    expect(selection.count()).toBe(1);
  });

  it("toggles selected state", () => {
    const selection = new SelectionStore();

    expect(selection.toggle("feature-1")).toBe(true);
    expect(selection.toggle("feature-1")).toBe(false);

    expect(selection.count()).toBe(0);
  });

  it("replaces multiple selections", () => {
    const selection = new SelectionStore();

    selection.replace(["a", "b", "c"]);

    expect(selection.getSelected()).toEqual(["a", "b", "c"]);
  });

  it("clears selection", () => {
    const selection = new SelectionStore();

    selection.selectMany(["a", "b"]);
    selection.clear();

    expect(selection.count()).toBe(0);
  });
});
