module.exports = (sequelize, DataTypes) => {
  const { TEXT } = DataTypes
  const Model = sequelize.define(
    'results_details_parcels',
    {
      userid: {
        type: TEXT,
        primaryKey: true
      },
      parcel_id: {
        type: TEXT,
        primaryKey: true,
      },
      own_name: {
        type: TEXT,
      },
      tenant_nam: {
        type: TEXT,
      },
      cert_doc: {
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
