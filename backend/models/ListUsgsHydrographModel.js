module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DOUBLE, REAL } = DataTypes;
  const Model = sequelize.define(
    'hydrograph_data',
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
      date_year: {
        type: INTEGER,
      },
      wateryear: {
        type: DOUBLE,
      },
      month_num: {
        type: DOUBLE,
      },
      watermonth: {
        type: INTEGER,
      },
      month_abbrev: {
        type: TEXT,
      },
      dayofmonth: {
        type: DOUBLE,
      },
      waterdayofyear: {
        type: DOUBLE,
        primaryKey: true,
      },
      flow_cfs: {
        type: REAL,
      },
      high_cfs: {
        type: REAL,
      },
      low_cfs: {
        type: REAL,
      },
      median_cfs: {
        type: REAL,
      },
      lowyear: {
        type: DOUBLE,
      },
      highyear: {
        type: DOUBLE,
      },
      x_axis_label: {
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
