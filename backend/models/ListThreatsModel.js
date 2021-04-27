module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes
  const Model = sequelize.define(
    'ec_list_threats',
    {
      threat_index: {
        type: INTEGER,
        primaryKey: true,
      },
      threat_desc: {
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
