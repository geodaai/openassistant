// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Create a serial executor that ensures that tasks are executed in order.
 * @returns A function that can be used to execute tasks in order.
 */
export function createSerialExecutor() {
  let currentPromise: Promise<unknown> | null = null;

  return async function execute<T>(task: () => Promise<T>): Promise<T> {
    // If there's an ongoing task, wait for it
    if (currentPromise) {
      await currentPromise;
    }

    // Create and store the new promise
    currentPromise = (async () => {
      try {
        return await task();
      } finally {
        currentPromise = null;
      }
    })();

    // Return the result
    return currentPromise as Promise<T>;
  };
}
