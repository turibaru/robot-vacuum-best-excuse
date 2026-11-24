import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  console.error("error: MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

let content: string;
try {
  content = readFileSync(entryPath, "utf8");
} catch (err) {
  console.error(`error: cannot read entry.txt: ${(err as Error).message}`);
  process.exit(1);
}

// Gate: the sealed scorer only accepts 1-140 characters of non-whitespace UTF-8 text; refuse the rest here.
const length = [...content].length;
if (length < 1 || length > 140 || content.trim().length === 0) {
  console.error(`error: entry.txt must be 1-140 characters, got ${length}`);
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "entry.txt"), content, "utf8");
} catch (err) {
  console.error(`error: cannot write output: ${(err as Error).message}`);
  process.exit(1);
}
