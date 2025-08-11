import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

// happy-dom/jsdom do not define VideoFrame, but three@0.179 checks it.
// Provide a minimal stub to avoid ReferenceError during tests.
if (typeof (globalThis as any).VideoFrame === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    (globalThis as any).VideoFrame = class {};
}
