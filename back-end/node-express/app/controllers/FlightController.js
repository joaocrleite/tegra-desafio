
const {Flight} = require('../../models/index');

exports.index = async (req, res, next) => {

    const flights = await Flight.findAll();

    res
        .status(200)
        .json({
            data: flights,
        });

};