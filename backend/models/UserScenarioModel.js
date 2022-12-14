module.exports = (sequelize, DataTypes) => {
  const { TEXT, DATE, TIME, INTEGER, GEOMETRY } = DataTypes;
  const Model = sequelize.define(
    "user_scenarios",
    {
      auth0_sub: {
        type: TEXT,
      },
      name: {
        type: TEXT,
      },
      json_data: {
        type: TEXT,
      },
      visible_layers: {
        type: TEXT,
      },
      enabled_layers: {
        type: TEXT,
      },
      // filter_layer_categories: {
      //   type: TEXT,
      // },
      // filter_geometry_types: {
      //   type: TEXT,
      // },
      start_date:{
        type: DATE,
      },
      end_date:{
        type: DATE,
      },
      user_scenario_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created_timestamp: {
        type: TIME,
      },
      geometry: {
        type: GEOMETRY,
      }
    },
    {
      timestamps: false,
      schema: "web",
      freezeTableName: true,
    }
  );
  return Model;
};
