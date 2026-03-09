import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        testTimeout: 30000,
        hookTimeout: 30000,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: [
                "controllers/**",
                "middlewares/**",
                "utils/**",
                "models/**",
            ],
        },
        setupFiles: ["./test/setup.js"],
    },
});
