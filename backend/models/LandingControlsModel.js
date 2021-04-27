module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER, REAL } = DataTypes
  const Model = sequelize.define(
    'landing_controls',
    {
      option_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      input_type_ndx: {
        type: INTEGER,
        primaryKey: true,
      },
      wt: {
        type: REAL,
      },
      userid: {
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
