module.exports = (sequelize, DataTypes) => {
  const { INTEGER, TEXT, REAL } = DataTypes;
  const Model = sequelize.define(
    "list_input_bins",
    {
      input_type_ndx: {
        type: INTEGER,
      },
      bin_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bin_description: {
        type: TEXT,
      },
      bin_low_val: {
        type: REAL,
      },
      bin_high_val: {
        type: REAL,
      },
      bin_score: {
        type: REAL,
      },
    },
    {
      timestamps: false,
      schema: "model",
      freezeTableName: true,
    }
  );
  return Model;
};
