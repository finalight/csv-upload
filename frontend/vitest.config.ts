// vite.config.ts or vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true, // optional but nice for `describe`, `it`, etc.
        setupFiles: './setupTests.ts',
    },
});
