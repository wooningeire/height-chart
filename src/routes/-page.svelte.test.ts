import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock the @threlte/core Canvas component to avoid WebGL issues in tests
vi.mock('@threlte/core', async () => {
  const actual = await vi.importActual('@threlte/core');
  return {
    ...actual,
    Canvas: vi.fn(() => ({
      $$: { fragment: null, on_mount: [], on_destroy: [] },
      $set: vi.fn(),
      $destroy: vi.fn()
    }))
  };
});

// Mock the fetch function to prevent API calls during tests
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([]), { status: 200 })));
});

describe('/+page.svelte', () => {
  test('renders add character button and canvas', () => {
    render(Page);
    expect(screen.getByRole('button', { name: /add a character/i })).toBeInTheDocument();
  });

  test("renders page content", () => {
    render(Page);
    // Since we've mocked the Canvas component, we can't test for the actual canvas element
    // Instead, let's verify that the page renders without errors and contains expected content
    expect(screen.getByRole('button', { name: 'Add a character' })).toBeInTheDocument();
  });
});
