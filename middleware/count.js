// Middkeware to check if the seat count is vakid or not
const checkCount = (req, res, next) => {
    const { seats } = req.body; // Expected: { seats: <number> }
    if (typeof seats !== "number" || seats < 1 || seats > 7) {
        return res.status(400).send({
            message: "Invalid seat count. Must be a number between 1 and 7.",
        });
    }
    next();
};

module.exports = { checkCount };
