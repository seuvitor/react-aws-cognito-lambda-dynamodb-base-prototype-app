import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: [
				"react",
				"react/jsx-runtime",
				"react-dom",
				"react-dom/client",
				"react-router-dom",
				/@aws-sdk\/.*/,
			],
		},
		sourcemap: true,
	},
	plugins: [
		react(),
		dts({ rollupTypes: true, tsconfigPath: "./tsconfig.app.json" }),
	],
	server: {
		port: 5000,
	},
});
