"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
// const config    = require(__dirname + '/config.json')[env];
const db = {};

const config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: "postgres",
  logging: false, //console.log,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USERNAME,
  process.env.PG_PASSWORD,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.UserGeometryModel = require("./UserGeometryModel")(sequelize, Sequelize);
db.UserLastActiveModel = require("./UserLastActiveModel")(sequelize, Sequelize);
db.ControlsListParam1Model = require("./ControlsListParam1Model")(sequelize, Sequelize);
db.ControlsListParam2Model = require("./ControlsListParam2Model")(sequelize, Sequelize);
db.ControlsListParam3Model = require("./ControlsListParam3Model")(sequelize, Sequelize);
db.ControlsListParamCustomModel = require("./ControlsListParamCustomModel")(sequelize, Sequelize);
db.LandingControlsModel = require("./LandingControlsModel")(sequelize, Sequelize);
db.ResultsModel = require("./ResultsModel")(sequelize, Sequelize);
db.ResultsDetailsModel = require("./ResultsDetailsModel")(sequelize, Sequelize);
db.ResultsDetailsParcelsModel = require("./ResultsDetailsParcelsModel")(sequelize, Sequelize);
db.ResultsDetailsAqVulnModel = require("./ResultsDetailsAqVulnModel")(sequelize, Sequelize);
db.ResultsDetailsLandUseModel = require("./ResultsDetailsLandUseModel")(sequelize, Sequelize);
db.ListInputsModel = require("./ListInputsModel")(sequelize, Sequelize);
db.ListInputTypesModel = require("./ListInputTypesModel")(sequelize, Sequelize);
db.ListInputBinsModel = require("./ListInputBinsModel")(sequelize, Sequelize);
db.ListInputValueTypesModel = require("./ListInputValueTypesModel")(sequelize, Sequelize);
db.ListParametersModel = require("./ListParametersModel")(sequelize, Sequelize);
db.ListPrioritiesModel = require("./ListPrioritiesModel")(sequelize, Sequelize);
db.ListThreatsModel = require("./ListThreatsModel")(sequelize, Sequelize);
db.SeasonalAnalysisStartDateModel = require("./SeasonalAnalysisStartDateModel")(sequelize, Sequelize);
db.SeasonalAnalysisEndDateModel = require("./SeasonalAnalysisEndDateModel")(sequelize, Sequelize);
db.DynamicFinalForPortalPointsModel = require("./DynamicFinalForPortalPointsModel")(sequelize, Sequelize);
db.DynamicFinalForPortalTableModel = require("./DynamicFinalForPortalTableModel")(sequelize, Sequelize);
db.GisUserIntersectLandUseModel = require("./GisUserIntersectLandUseModel")(sequelize, Sequelize);
db.GisUserIntersectStationsModel = require("./GisUserIntersectStationsModel")(sequelize, Sequelize);

Sequelize.postgres.DECIMAL.parse = function (value) {
  return parseFloat(value);
};
Sequelize.postgres.BIGINT.parse = function (value) {
  return parseInt(value);
};

module.exports = db;
