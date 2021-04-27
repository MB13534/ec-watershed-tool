module.exports = (sequelize, DataTypes) => {
  const { DATE } = DataTypes;
  const Model = sequelize.define(
    "seasonal_analysis_end_date",
    {
      analysis_end_date: {
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
