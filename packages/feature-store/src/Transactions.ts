export interface TransactionSnapshot<T> {
  readonly state: T;
}

export class TransactionManager<T> {
  private snapshot: TransactionSnapshot<T> | null = null;

  constructor(
    private readonly capture: () => T,
    private readonly restore: (state: T) => void,
  ) {}

  beginTransaction(): void {
    if (this.snapshot) {
      throw new Error("A transaction is already active.");
    }

    this.snapshot = { state: this.capture() };
  }

  commit(): void {
    if (!this.snapshot) {
      throw new Error("No active transaction to commit.");
    }

    this.snapshot = null;
  }

  rollback(): void {
    if (!this.snapshot) {
      throw new Error("No active transaction to roll back.");
    }

    this.restore(this.snapshot.state);
    this.snapshot = null;
  }

  isInTransaction(): boolean {
    return this.snapshot !== null;
  }
}
