/*eslint-env node*/

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * @param {string} fn filename
 * @param {string} data contents
 */
function save(fn, data) {
  writeFileSync(fn, data, { encoding: "utf-8" });
  console.log(`Wrote: ${fn}`);
}

/**
 *
 * @param {string} root directory
 * @param {(fn: string, data: string) => T|undefined} gen generator
 * @returns {T[]}
 */
function treeGen(root, gen) {
  const outputs = [];

  for (const entry of readdirSync(root, {
    encoding: "utf-8",
    recursive: true,
    withFileTypes: true,
  })) {
    if (entry.isFile()) {
      const fullPath = join(entry.path, entry.name);
      const result = gen(
        fullPath.slice(4, -3).replace(/\\/g, "/"),
        readFileSync(fullPath, { encoding: "utf-8" })
      );

      if (result) outputs.push(result);
    }
  }

  return outputs;
}

const properNames = ["Agathys", "Melf"];

/**
 * @param {string} s
 */
function formatName(s) {
  s = s.toLocaleLowerCase();

  for (const name of properNames) {
    const i = s.indexOf(name.toLocaleLowerCase());
    if (i >= 0) s = s.slice(0, i) + name + s.slice(i + name.length);
  }

  return s;
}

function collateBackgrounds() {
  const namePattern = /name: "(.*)",/;
  const varNamePattern = /export default ([a-zA-Z]*);/;

  const backgrounds = treeGen("./src/backgrounds", (fn, input) => {
    const name = namePattern.exec(input);
    const varName = varNamePattern.exec(input);
    if (name && varName) return { fn, name: name[1], varName: varName[1] };
  });

  let importLines = [];
  let dataLines = [];

  for (const { fn, name, varName } of backgrounds) {
    importLines.push(`import ${varName} from "../${fn}";`);
    dataLines.push(`"${name}": ${varName},`);
  }

  save(
    "./src/data/allBackgrounds.ts",
    `${importLines.join("\n")}

const allBackgrounds = { ${dataLines.join("\n")} } as const;
export default allBackgrounds;

export type BackgroundName = keyof typeof allBackgrounds;`
  );
}

function collateSpells() {
  const levelPattern = /level: (\d+),/;
  const namePattern = /name: "(.*)",/;
  const varNamePattern = /export default ([a-zA-Z]*);/;

  const spells = treeGen("./src/spells", (fn, input) => {
    const level = levelPattern.exec(input);
    const name = namePattern.exec(input);
    const varName = varNamePattern.exec(input);
    if (level && name && varName)
      return {
        fn,
        level: Number(level[1]),
        name: formatName(name[1]),
        varName: varName[1],
      };
  });

  let importLines = [];
  let dataLines = [];

  let prevLevel = 0;
  for (const { fn, level, name, varName } of spells) {
    importLines.push(`import ${varName} from "../${fn}";`);

    if (prevLevel !== level) {
      prevLevel = level;
      dataLines.push("");
    }

    dataLines.push(`"${name}": ${varName},`);
  }

  save(
    "./src/data/allSpells.ts",
    `${importLines.join("\n")}

const allSpells = { ${dataLines.join("\n")} } as const;
export default allSpells;

export type SpellName = keyof typeof allSpells;`
  );
}

collateBackgrounds();
collateSpells();
