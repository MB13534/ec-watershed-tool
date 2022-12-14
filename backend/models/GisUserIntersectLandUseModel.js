module.exports = (sequelize, DataTypes) => {
  const { REAL, TEXT } = DataTypes;
  const Model = sequelize.define(
    "gis_userintersect_landuse",
    {
      userid: {
        type: TEXT,
        primaryKey: true,
      },
      use_new: {
        type: TEXT,
        primaryKey: true,
      },
      background_landuse: {
        type: TEXT,
      },
      scenario_landuse: {
        type: TEXT,
      },
      acres: {
        type: REAL,
      },
      total_acres: {
        type: REAL,
      },
      pct_of_total: {
        type: TEXT,
      },
    },
    {
      timestamps: false,
      schema: "analysis",
      freezeTableName: true,
    }
  );
  return Model;
};
