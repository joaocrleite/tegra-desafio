'use strict';

const fs = require('fs');
const csv = require('csv-parser');


const {Flight} = require('../models/index');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let rawdata = fs.readFileSync('../../docs/99planes.json');
    let rawFlights = JSON.parse(rawdata);

    let flights = [];

    await rawFlights.forEach(async row=>{

        let take_off_at = row.data_saida + ' ' + row.saida + ':00';
        let landing_at = row.data_saida + ' ' + row.chegada + ':00';

        let dataFlight = {
            company: '99Planes',
            cod: row.voo,
            from: row.origem,
            to: row.destino,
            amount: row.valor,
            date:  row.data_saida,
            take_off_at,
            landing_at,
        };

        flights.push(dataFlight);

    });

    let rawFlights2 = [];
    let flights2 = []

    fs.createReadStream('../../docs/uberair.csv').pipe(csv())
      .on('data', (row) => {

        let take_off_at = row.data + ' ' + row.horario_saida + ':00';
        let landing_at = row.data + ' ' + row.horario_chegada + ':00';

        let dataFlight = {
            company: 'Uberair',
            cod: row.numero_voo,
            from: row.aeroporto_origem,
            to: row.aeroporto_destino,
            amount: row.preco,
            date: row.data,
            take_off_at,
            landing_at,
        };

        flights2.push(dataFlight);
        
      })
      .on('end', () =>{
        queryInterface.bulkInsert('Flights', flights2 , {});
      });

    
    return queryInterface.bulkInsert('Flights', flights , {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Flights', null, {});
  }
};
