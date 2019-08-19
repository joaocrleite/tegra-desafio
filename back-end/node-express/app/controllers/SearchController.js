

exports.index = (req, res, next) => {

    const body = req.body;
    
    res
        .status(200)
        .json({
            status: true,
            body : body
        });

};