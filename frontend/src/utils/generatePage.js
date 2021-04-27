const fs = require("fs");
const directoryName = process.argv[2];

fs.mkdirSync("./src/pages/" + directoryName);
fs.writeFileSync(
  `./src/pages/${directoryName}/index.js`,
  `export { default } from "./${directoryName}"`
);
fs.writeFileSync(`./src/pages/${directoryName}/${directoryName}.js`, ``);
