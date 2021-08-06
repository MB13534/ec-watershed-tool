module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DOUBLE, REAL } = DataTypes;
  const Model = sequelize.define(
    'table_stats_info',
    {
      station_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      usgs_site_no: {
        type: TEXT,
      },
      station_desc: {
        type: TEXT,
      },
      porminyear: {
        type: DOUBLE,
      },
      pormaxyear: {
        type: DOUBLE,
      },
      highest_year: {
        type: DOUBLE,
      },
      highest_year_pctnorm: {
        type: REAL,
      },
      lowest_year: {
        type: DOUBLE,
      },
      lowest_year_pctnorm: {
        type: REAL,
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
