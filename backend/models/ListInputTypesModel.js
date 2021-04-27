const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, REAL, BOOLEAN } = DataTypes;

  const Model = sequelize.define(
    "list_input_types",
    {
      input_type_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      input_type_desc: {
        type: TEXT,
      },
      input_type_label: {
        type: TEXT,
      },
      default_weighting_factor: {
        type: REAL,
      },
      input_type_notes: {
        type: TEXT,
      },
      static: {
        type: BOOLEAN,
        defaultValue: false,
      },
      ui_sort: {
        type: INTEGER,
        defaultValue: 1,
      },
    },
    {
      timestamps: false,
      schema: "model",
      freezeTableName: true,
      defaultScope: {
        where: {
          ui_sort: {
            [Op.gt]: 0,
          },
        },
      }
    }
  );
  return Model;
};
