module.exports = (sequelize, DataTypes) => {
  const { DOUBLE } = DataTypes;
  const Model = sequelize.define(
    'list_wateryears',
    {
      wateryear: {
        type: DOUBLE,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      schema: 'supplies',
      freezeTableName: true,
    }
  );
  return Model;
};
