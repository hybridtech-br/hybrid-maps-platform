import { describe, expect, it } from "vitest";
import { TransactionManager } from "../src/Transactions.js";

describe("TransactionManager", () => {
  it("commits active transactions", () => {
    let value = 1;
    const manager = new TransactionManager(
      () => value,
      (state) => { value = state; },
    );

    manager.beginTransaction();
    value = 2;
    manager.commit();

    expect(value).toBe(2);
    expect(manager.isInTransaction()).toBe(false);
  });

  it("restores state on rollback", () => {
    let value = 1;
    const manager = new TransactionManager(
      () => value,
      (state) => { value = state; },
    );

    manager.beginTransaction();
    value = 10;
    manager.rollback();

    expect(value).toBe(1);
  });

  it("prevents nested transactions", () => {
    const manager = new TransactionManager(
      () => 1,
      () => undefined,
    );

    manager.beginTransaction();

    expect(() => manager.beginTransaction()).toThrow();
  });
});
