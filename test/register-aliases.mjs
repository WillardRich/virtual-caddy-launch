import { registerHooks } from "node:module";

// Match the application's Vite alias when importing source modules in Node tests.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const sourcePath = specifier.slice(2);
      const file = sourcePath === "lib/courses" ? "lib/courses/index" : sourcePath;
      return nextResolve(new URL(`../src/${file}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});
