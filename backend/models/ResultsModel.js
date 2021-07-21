module.exports = (sequelize, DataTypes) => {
  const { TEXT, REAL } = DataTypes
  const Model = sequelize.define(
    'results_OLD',
    {
      table_label: {
        type: TEXT,
        primaryKey: true
      },
      user_scenario_score: {
        type: REAL,
      },
      delta: {
        type: TEXT,
      },
      userid: {
        type: TEXT,
        primaryKey: true
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
