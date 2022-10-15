import fs from "fs";
import path from "path";

const tmpPath = path.resolve("tmp");

export function clearTmp(filter) {
  const fileNames = fs.readdirSync(tmpPath);
  const currentFileNames = fileNames.filter(filter || (() => true));
  for (let fileName of currentFileNames) {
    fs.rmSync(path.join(tmpPath, fileName));
  }
}