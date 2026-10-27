import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // `base` defaults to process.cwd(); pin it to the project root so
      // `@import "tailwindcss"` still resolves when the dev server is
      // started from another directory.
      base: dirname(fileURLToPath(import.meta.url)),
    },
  },
};

export default config;
