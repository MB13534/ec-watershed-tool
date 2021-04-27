require("dotenv").config({ path: "./.env" });
const fs = require("fs");
const { Columns } = require("../models");

const directoryName = process.argv[2];
const fileName = process.argv[3];
const schema = process.argv[4];
const table = process.argv[5];

Columns.findAll({
  where: {
    table_schema: schema,
    table_name: table,
  },
})
  .then((data) => {
    if (fs.existsSync("./models/" + directoryName)) {
      fs.rmdirSync("./models/" + directoryName, { recursive: true });
    }

    if (fs.existsSync("./routes/" + directoryName)) {
      fs.rmdirSync("./routes/" + directoryName, { recursive: true });
    }

    const mapped = data.map((d) => d.dataValues);
    const types = [...new Set(mapped.map((d) => d.data_type.toUpperCase()))];

    const generateFields = (fields) => {
      let obj = {};
      fields.map((field) => {
        return (obj[field.column_name] = {
          type: `${field.data_type.toUpperCase()}`,
        });
      });
      return JSON.stringify(obj);
    };

    let fileString = `
      module.exports = (sequelize, DataTypes) => {
        const { ${types.join(", ")} } = DataTypes;
        const ${fileName} = sequelize.define(
          "${table}",
          ${generateFields(mapped)},
          {
            timestamps: false,
            schema: "${schema}",
            freezeTableName: true,
          }
        );
        return ${fileName};
      };
    `;

    const regex1 = /"type":"/g;
    const regex2 = /"},/g;
    const regex3 = /"}/g;
    fileString = fileString.replace(regex1, '"type": ');
    fileString = fileString.replace(regex2, " }, ");
    fileString = fileString.replace(regex3, " }, ");

    fs.mkdirSync("./models/" + directoryName);
    fs.mkdirSync("./routes/" + directoryName);

    fs.writeFileSync(`./models/${directoryName}/${fileName}.js`, fileString);
    fs.writeFileSync(
      `./routes/${directoryName}/index.js`,
      `const {
      checkAccessToken,
      checkPermission,
    } = require("../../middleware/auth.js");
    const { generateRoutes } = require("../../middleware/generateRoutes.js");
    const { ${fileName} } = require("../../models");

    const router = generateRoutes({
      middleware: [
        checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE),
      ],
      model: ${fileName},
      ndxField: "POPULATE_ME",
    });

    module.exports = router;`
    );
    console.log("API resources created!");
  })
  .catch((err) => {
    console.error(err);
  });
