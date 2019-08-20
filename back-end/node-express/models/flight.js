'use strict';
module.exports = (sequelize, DataTypes) => {

  const Flight = sequelize.define('Flight', {
    cod: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    company: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10,2),
    date: DataTypes.DATEONLY,
    take_off_at: DataTypes.DATE,
    landing_at: DataTypes.DATE,
  }, {});

  Flight.associate = function(models) {
    // associations can be defined here
  };
  return Flight;
};
