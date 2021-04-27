module.exports = (sequelize, DataTypes) => {
  const { TEXT, REAL } = DataTypes
  const Model = sequelize.define(
    'results_details',
    {
      table_label: {
        type: TEXT,
        primaryKey: true
      },
      wt: {
        type: REAL,
      },
      input_value: {
        type: REAL,
      },
      delta: {
        type: TEXT,
      },
      userid: {
        type: TEXT,
        primaryKey: true
      },
      input_category: {
        type: TEXT,
      },
      input_description: {
        type: TEXT,
      },
      baseline_risk: {
        type: REAL,
      },
      scenario_risk: {
        type: REAL,
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
