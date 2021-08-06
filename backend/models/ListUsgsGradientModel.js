module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DOUBLE, REAL } = DataTypes;
  const Model = sequelize.define(
    'map_points_gradient',
    {
      station_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      station_abrev: {
        type: TEXT,
      },
      wateryear: {
        type: DOUBLE,
      },
      watermonth: {
        type: INTEGER,
      },
      month_abbrev: {
        type: TEXT,
      },
      pctnorm_num: {
        type: REAL,
      },
      usgs_site_no: {
        type: TEXT,
      },
    },
    {
      timestamps: false,
      schema: 'supplies',
      freezeTableName: true,
    }
  );
  return Model;
};
