module.exports = (sequelize, DataTypes) => {
  const { INTEGER, TEXT } = DataTypes;
  const Model = sequelize.define(
    "_dynamic_final_for_portal_points",
    {
      all_85_bmk: {
        type: INTEGER,
      },
      all_med_bmk: {
        type: INTEGER,
      },
      location_index: {
        type: INTEGER,
        primaryKey: true,
      },
      location_name: {
        type: TEXT,
      },
      parameter_index: {
        type: INTEGER,
        primaryKey: true,
      },
      parameter_abbrev: {
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
