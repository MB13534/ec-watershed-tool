module.exports = (sequelize, DataTypes) => {
  const { INTEGER, DOUBLE, TEXT, BIGINT } = DataTypes;
  const Model = sequelize.define(
    "gis_userintersect_stations",
    {
      userid: {
        type: TEXT,
        primaryKey: true,
      },
      location_index: {
        type: INTEGER,
        primaryKey: true,
      },
      location_name: {
        type: TEXT,
      },
      loc_lat: {
        type: DOUBLE,
      },
      loc_long: {
        type: DOUBLE,
      },
      huc12: {
        type: BIGINT,
      },
      loc_type: {
        type: TEXT,
      },
      huc_name: {
        type: TEXT,
      },
      huc_acres: {
        type: DOUBLE,
      },
      location_id: {
        type: TEXT,
      },
      por: {
        type: TEXT,
      },
      params: {
        type: TEXT,
      },
      params_c: {
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
