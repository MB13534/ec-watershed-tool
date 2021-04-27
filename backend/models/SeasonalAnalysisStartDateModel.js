module.exports = (sequelize, DataTypes) => {
  const { DATE } = DataTypes;
  const Model = sequelize.define(
    "seasonal_analysis_start_date",
    {
      analysis_start_date: {
        type: DATE,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
      schema: "analysis",
      freezeTableName: true,
    }
  );
  return Model;
};
