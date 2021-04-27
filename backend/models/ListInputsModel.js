const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, REAL, BOOLEAN } = DataTypes;
  const Model = sequelize.define(
    "list_inputs",
    {
      input_ndx: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      input_type_ndx: {
        type: INTEGER,
      },
      input_desc: {
        type: TEXT,
      },
      value_type_ndx: {
        type: INTEGER,
      },
      input_value: {
        type: REAL,
      },
      default: {
        type: BOOLEAN,
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
          value_type_ndx: {
            [Op.ne]: 3,
          },
        },
        order: [['value_type_ndx', 'ASC'], ['input_type_ndx', 'ASC'], ['input_value', 'ASC']]
      }
    }
  );
  return Model;
};
