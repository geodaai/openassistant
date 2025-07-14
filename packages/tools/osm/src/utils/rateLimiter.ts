// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * A utility class for rate limiting API calls
 */
export class RateLimiter {
  private lastCallTime: number = 0;
  private minInterval: number;

  constructor(minIntervalMs: number = 1000) {
    this.minInterval = minIntervalMs;
  }

  async waitForNextCall(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;

    if (timeSinceLastCall < this.minInterval) {
      await this.delay(this.minInterval - timeSinceLastCall);
    }

    this.lastCallTime = Date.now();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create shared rate limiter instances for different services
export const githubRateLimiter = new RateLimiter(1000); // 1 second delay for GitHub API
export const mapboxRateLimiter = new RateLimiter(1000); // 1 second delay for Mapbox API
