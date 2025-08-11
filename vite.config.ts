import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { threlteTesting } from '@threlte/test/vite';

export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        dedupe: ["three"],
    },
	test: {
        projects: [
			{
				extends: './vite.config.ts',
                plugins: [svelteTesting(), threlteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
                    setupFiles: [
                        './vitest-setup-client.ts',
                        './src/tests/setup-canvas.ts'
                    ]
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
