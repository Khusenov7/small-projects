import express from "express";
import fs from "fs";
import path from "path";
import sloc from "sloc";
import escomplex from "escomplex";

const router = express.Router();

router.get("/", (req, res) => {
  const code = fs.readFileSync(path.join(process.cwd(), "server.js"), "utf-8");

  const slocResult = sloc(code, "js");
  const escomplexResult = escomplex.analyse(code);

  res.json({
    SLOC: slocResult,
    CyclomaticComplexity: escomplexResult.aggregate.cyclomatic,
    Halstead: escomplexResult.aggregate.halstead,
  });
});

export default router;
