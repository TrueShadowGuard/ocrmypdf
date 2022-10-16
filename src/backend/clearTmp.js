import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const tmpPath = path.join(__dirname, "tmp");

export function clearTmp(filter) {
  const fileNames = fs.readdirSync(tmpPath);
  const currentFileNames = fileNames.filter(filter || (() => true));
  for (let fileName of currentFileNames) {
    fs.rmSync(path.join(tmpPath, fileName));
  }
}