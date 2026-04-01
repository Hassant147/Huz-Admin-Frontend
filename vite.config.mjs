import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, transformWithEsbuild } from "vite";

const jsxInJsPlugin = () => ({
  name: "jsx-in-js",
  async transform(code, id) {
    if (!id.includes("/src/") || !id.endsWith(".js")) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      loader: "jsx",
      jsx: "automatic",
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const compatEnv = {
    ...Object.fromEntries(
      Object.entries(env).filter(
        ([key]) =>
          (key.startsWith("REACT_APP_") && key !== "REACT_APP_AUTH_TOKEN") ||
          key.startsWith("VITE_") ||
          key === "PUBLIC_URL"
      )
    ),
    NODE_ENV: mode,
    PUBLIC_URL: env.PUBLIC_URL || "",
  };

  return {
    plugins: [jsxInJsPlugin(), react()],
    envPrefix: ["VITE_", "REACT_APP_"],
    define: {
      "process.env": compatEnv,
    },
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    },
  };
});
