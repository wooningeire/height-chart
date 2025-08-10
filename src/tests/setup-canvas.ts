import { vi, beforeEach } from 'vitest';

// Setup canvas for jsdom
beforeEach(() => {
  // Mock ResizeObserver for @threlte/extras
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});
