

exports.index = (req, res, next) => {

    res
        .status(200)
        .json({
            title: "Node Express API",
            version: "0.0.1"
        });

};