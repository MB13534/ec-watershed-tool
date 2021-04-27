module.exports = (sequelize, DataTypes) => {
  const { REAL, INTEGER, TEXT, BIGINT } = DataTypes;
  const Model = sequelize.define(
    "_dynamic_final_for_portal_table",
    {
      parameter_abbrev: {
        type: TEXT,
      },
      units: {
        type: TEXT,
      },
      stat_85: {
        type: REAL,
      },
      bval_85: {
        type: INTEGER,
      },
      stat_median: {
        type: REAL,
      },
      bval_median: {
        type: INTEGER,
      },
      recordcount: {
        type: BIGINT,
      },
      trend: {
        type: TEXT,
      },
      parameter_index: {
        type: INTEGER,
        primaryKey: true,
      },
      location_index: {
        type: INTEGER,
        primaryKey: true,
      },
      location_name: {
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
