module.exports = (sequelize, DataTypes) => {
  const { TEXT } = DataTypes;
  const Model = sequelize.define(
    "user_last_active",
    {
      auth0_sub: {
        type: TEXT,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      schema: "web",
      freezeTableName: true,
    }
  );
  return Model;
};
