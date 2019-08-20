
const {Airport} = require('../../models/index');

exports.index = async (req, res, next) => {

    const airports = await Airport.findAll();

    res
        .status(200)
        .json({
            data: airports,
        });

};