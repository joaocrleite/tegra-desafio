'use strict';
module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define('Airport', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    city: DataTypes.STRING
  }, {});
  Airport.associate = function(models) {
    // associations can be defined here
  };
  return Airport;
};