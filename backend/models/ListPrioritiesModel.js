module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes
  const Model = sequelize.define(
    'ec_list_priorities',
    {
      priority_index: {
        type: INTEGER,
        primaryKey: true,
      },
      priority_desc: {
        type: TEXT,
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
