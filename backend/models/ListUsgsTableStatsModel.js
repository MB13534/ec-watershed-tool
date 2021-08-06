module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, DOUBLE } = DataTypes;
  const Model = sequelize.define(
    'table_stats_data',
    {
      station_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      usgs_site_no: {
        type: TEXT,
      },
      wateryear: {
        type: DOUBLE,
      },
      watermonth: {
        type: INTEGER,
      },
      station_desc: {
        type: TEXT,
      },
      month_abbrev: {
        type: TEXT,
      },
      month_name: {
        type: TEXT,
      },
      pct_of_normal: {
        type: TEXT,
      },
      cumulative_af: {
        type: TEXT,
      },
      lowest_year_cumulative_af: {
        type: TEXT,
      },
      highest_year_cumulative_af: {
        type: TEXT,
      },
      median_year_cumulative_af: {
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
