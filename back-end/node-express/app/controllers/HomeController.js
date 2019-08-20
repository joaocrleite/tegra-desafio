
const fs = require('fs');
const csv = require('csv-parser');

const {Flight} = require('../../models/index');

exports.index = (req, res, next) => {

    res
        .status(200)
        .json({
            title: "Node Express API",
            version: "0.0.1"
        });

};

exports.ninenineplanes = async (req, res, next) => {

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
            take_off_at,
            landing_at,
        };

        let flight = await Flight.create(dataFlight);

        flights.push(flight);

    });

    res
        .status(200)
        .json({
            data: flights,
            raw : rawFlights
        });

};

exports.uberair = async (req, res, next) => {

    let rawFlights = [];
    let flights = [];

    fs.createReadStream('../../docs/uberair.csv')
        .pipe(csv())
        .on('data', (data) => rawFlights.push(data))
        .on('end', async () => {

            await rawFlights.forEach(async row=>{

                let take_off_at = row.data + ' ' + row.horario_saida + ':00';
                let landing_at = row.data + ' ' + row.horario_chegada + ':00';
        
                let dataFlight = {
                    company: 'Uberair',
                    cod: row.numero_voo,
                    from: row.aeroporto_origem,
                    to: row.aeroporto_destino,
                    amount: row.preco,
                    take_off_at,
                    landing_at,
                };
        
                let flight = await Flight.create(dataFlight);
        
                flights.push(flight);
        
            });
        
            res
                .status(200)
                .json({
                    data: flights,
                    raw : rawFlights
                });
        
        
        });

    

};