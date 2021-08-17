module.exports = (sequelize, DataTypes) => {
  const { REAL, INTEGER, TEXT, DATE } = DataTypes;
  const Model = sequelize.define(
    '_dynamic_final_for_portal_timeseries_data',
    {
      location_index: {
        type: INTEGER,
        primaryKey: true,
      },
      parameter_index: {
        type: INTEGER,
      },
      location_id: {
        type: TEXT,
      },
      location_name: {
        type: TEXT,
      },
      parameter_abbrev: {
        type: TEXT,
      },
      activity_date: {
        type: DATE,
      },
      data_value: {
        type: REAL,
      },
      units: {
        type: TEXT,
      },
      source: {
        type: TEXT,
      },
      bmk_0_1: {
        type: REAL,
      },
      bmk_1_2: {
        type: REAL,
      },
      bmk_2_3: {
        type: REAL,
      },
      bmk_3_4: {
        type: REAL,
      },
      pctile_basis: {
        type: INTEGER,
      },
    },
    {
      timestamps: false,
      schema: 'analysis',
      freezeTableName: true,
    }
  );
  return Model;
};
