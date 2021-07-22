module.exports = (sequelize, DataTypes) => {
  const { TEXT, REAL } = DataTypes;
  const Model = sequelize.define(
    "gis_userintersect_parcels",
    {
      userid: {
        type: TEXT,
        primaryKey: true,
      },
      parcel_id: {
        type: TEXT,
      },
      acres: {
        type: REAL,
      },
      schedule_n: {
        type: TEXT,
        primaryKey: true,
      },
      url: {
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
