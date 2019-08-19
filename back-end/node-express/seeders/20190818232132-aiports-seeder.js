'use strict';

const fs = require('fs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      let rawdata = fs.readFileSync('../../docs/aeroportos.json');
      let rawAirports = JSON.parse(rawdata);

      let airports = [];

      rawAirports.forEach(element => {
        
        airports.push({
          name: element.nome,
          slug: element.aeroporto,
          city: element.cidade,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      });

      return queryInterface.bulkInsert('Airports', airports , {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Airports', null, {});
  }
};
