module.exports = (sequelize, DataTypes) => {
  const { TEXT } = DataTypes
  const Model = sequelize.define(
    'results_details_aqvuln',
    {
      userid: {
        type: TEXT,
        primaryKey: true
      },
      intersection_info: {
        type: TEXT,
      },
      dtgw_heading: {
        type: TEXT,
      },
      dtgw_values: {
        type: TEXT,
      },
      clayth_heading: {
        type: TEXT,
      },
      clayth_values: {
        type: TEXT,
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
