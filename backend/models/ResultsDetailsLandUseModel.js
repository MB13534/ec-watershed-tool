module.exports = (sequelize, DataTypes) => {
  const { TEXT, REAL } = DataTypes
  const Model = sequelize.define(
    'results_details_landuse',
    {
      userid: {
        type: TEXT,
        primaryKey: true
      },
      use_new: {
        type: TEXT,
        primaryKey: true,
      },
      background_landuse: {
        type: TEXT,
        primaryKey: true,
      },
      scenario_landuse: {
        type: TEXT,
        primaryKey: true,
      },
      acres: {
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
