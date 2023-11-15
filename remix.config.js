/** @type {import('@remix-run/dev').AppConfig} */
export default {
	ignoredRouteFiles: ["**/.*"],
	tailwind: true,
	autoprefixer: true,
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// publicPath: "/build/",
	serverModuleFormat: "esm",
	serverPlatform: "node",
	serverBuildPath: "build/index.js",
	browserNodeBuiltinsPolyfill: {
		modules: {
			crypto: true,
		},
	},
};
