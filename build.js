import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. Run Astro build
console.log("Running astro build...");
execSync("bunx astro build", { stdio: "inherit" });

const DIST_DIR = "./dist";
const CSS_DIR = path.join(DIST_DIR, "_astro");

// 2. Combine all generated CSS files
let cssContent = "";
fs.readdirSync(CSS_DIR).forEach((file) => {
  if (file.endsWith(".css")) {
    cssContent += fs.readFileSync(path.join(CSS_DIR, file), "utf-8") + "\n";
  }
});

// 3. Recursively find all HTML files in dist
function walkDir(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

const htmlFiles = walkDir(DIST_DIR);

// 4. Inject CSS into each HTML file
htmlFiles.forEach((file) => {
  let html = fs.readFileSync(file, "utf-8");

  if (html.includes("<head>")) {
    html = html.replace(
      /<head>/,
      `<head>\n<style>\n${cssContent}</style>`
    );
  } else {
    html = `<head><style>\n${cssContent}</style></head>\n${html}`;
  }

  fs.writeFileSync(file, html, "utf-8");
  console.log(`Injected CSS into ${file}`);
});

// 5. Optional: delete _astro CSS files
fs.readdirSync(CSS_DIR).forEach((file) => {
  if (file.endsWith(".css")) {
    fs.unlinkSync(path.join(CSS_DIR, file));
  }
});

console.log("CSS inlined and _astro/*.css files deleted. Build is self-contained.");

execSync("find ./dist -type d -empty", { stdio: "inherit" });
