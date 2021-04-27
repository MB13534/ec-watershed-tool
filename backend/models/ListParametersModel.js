module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes
  const Model = sequelize.define(
    'ec_list_parameters',
    {
      parameter_index: {
        type: INTEGER,
        primaryKey: true,
      },
      parameter_abbrev: {
        type: TEXT,
      },
      priority_index: {
        type: INTEGER,
      },
      risk_index: {
        type: INTEGER,
      },
    },
    {
      timestamps: false,
      schema: 'analysis',
      freezeTableName: true,
    },
  )
  return Model
}
