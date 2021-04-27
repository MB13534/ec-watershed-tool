const fs = require("fs");
const directoryName = process.argv[2];

fs.mkdirSync("./src/components/" + directoryName);
fs.writeFileSync(
  `./src/components/${directoryName}/index.js`,
  `export { default } from "./${directoryName}"`
);
fs.writeFileSync(`./src/components/${directoryName}/${directoryName}.js`, ``);
