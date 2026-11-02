import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data.json");

// JSON o‘qish
export function readData() {
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");
  return JSON.parse(fs.readFileSync(dataFile));
}

// JSON yozish
export function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
