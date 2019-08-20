
const {Flight, Airport} = require('../../models/index');

const {Op} = require("sequelize");

exports.index = async (req, res, next) => {

    const {from, to, date} = req.body;

    const flights = [];

    const directFlights = await Flight.findAll({
        where:{
            from,
            to,
            date
        }
    });

    directFlights.forEach(row=>{


        let flight = {
            from: row.from,
            to: row.to,
            take_off_at: row.take_off_at,
            landing_at: row.landing_at,
            scales:[
                {
                    from: row.from,
                    to: row.to,
                    take_off_at: row.take_off_at,
                    landing_at: row.landing_at,
                    company: row.company,
                    amount: row.amount
                }
            ]
        }

        flights.push(flight);

    });


    const notDirectFlights = await Flight.findAll({
        where:{
            from,
            to: {
                [Op.ne] : to
            },
            date
        }
    });

    const withScaleFlights = [];

    for(var i = 0; i < notDirectFlights.length; i++){

        const firstScale = notDirectFlights[i];
        let firstLandingAt = firstScale.landing_at;
        let next12Hours =  new Date(firstLandingAt.getTime() + (12*60*60*1000));

        let nextScales = await Flight.findAll({
            where:{
                from: firstScale.to,
                to,
                take_off_at:{
                    [Op.gt]: firstLandingAt,
                    [Op.lt]: next12Hours
                }
            }
        });

        nextScales.forEach(nextScale=>{

            let flight = {
                from: firstScale.from,
                to: nextScale.to,
                take_off_at: firstScale.take_off_at,
                landing_at: nextScale.landing_at,
                scales:[
                    {
                        from: firstScale.from,
                        to: firstScale.to,
                        take_off_at: firstScale.take_off_at,
                        landing_at: firstScale.landing_at,
                        company: firstScale.company,
                        amount: firstScale.amount
                    },
                    {
                        from: nextScale.from,
                        to: nextScale.to,
                        take_off_at: nextScale.take_off_at,
                        landing_at: nextScale.landing_at,
                        company: nextScale.company,
                        amount: nextScale.amount
                    }
                ]
            };

            flights.push(flight);
            withScaleFlights.push(flight);
        });

    }

    for(var i = 0; i < flights.length; i++){

        let flight = flights[i];

        for(var y = 0; y < flight.scales.length; y++){

            let scale = flight.scales[y];

            let from = await Airport.findOne({
                where:{
                    slug : scale.from
                }
            });

            scale.from = {
                name: from.name,
                slug: from.slug,
                city: from.city
            };

            let to = await Airport.findOne({
                where:{
                    slug : scale.to
                }
            });

            scale.to = {
                name: to.name,
                slug: to.slug,
                city: to.city
            };

        }

    }

    res
        .status(200)
        .json({
            data: flights
        });

};