module.exports = (sequelize, DataTypes) => {
  const { TEXT, INTEGER } = DataTypes;
  const Model = sequelize.define(
    'list_months',
    {
      watermonth: {
        type: INTEGER,
        primaryKey: true,
      },
      month_abbrev: {
        type: TEXT,
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
