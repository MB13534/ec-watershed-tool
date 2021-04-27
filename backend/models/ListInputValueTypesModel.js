module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes;

  const Model = sequelize.define(
    "bmp_types_dropdown_list",
    {
      value_type_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      value_type_desc: {
        type: TEXT,
      },
    },
    {
      timestamps: false,
      schema: "web",
      freezeTableName: true,
    }
  );
  return Model;
};
