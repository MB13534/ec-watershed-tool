module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, BOOLEAN, REAL } = DataTypes
  const Model = sequelize.define(
    'controls_list_param_1',
    {
      option_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      option_desc: {
        type: TEXT,
      },
      wt_default: {
        type: REAL,
      },
      select_default: {
        type: BOOLEAN,
      },
      input_type_ndx: {
        type: INTEGER,
      },
    },
    {
      timestamps: false,
      schema: 'web',
      freezeTableName: true,
    },
  )
  return Model
}
