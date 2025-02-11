const esbuild = require("esbuild");
const pkg = require("./package.json");

esbuild.build({
	entryPoints: ["./src/index.ts"],
	loader: { ".ts": "tsx" },
	outfile: "dist/cjs/index.js",
	bundle: true,
	format: "cjs",
	sourcemap: true,
	logLevel: "info",
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
});

esbuild.build({
	entryPoints: ["./src/index.ts"],
	loader: { ".ts": "tsx" },
	outfile: "dist/esm/index.js",
	bundle: true,
	format: "esm",
	sourcemap: true,
	logLevel: "info",
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
});
