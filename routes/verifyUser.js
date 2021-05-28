const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        // console.log(token);
        if (!token) {
            return res
                .status(401)
                .json({ msg: "No authentication token, authorization denied." });
        }

        const verified = jwt.verify(token, 'NishantRana');

        if (!verified) {
            return res
                .status(401)
                .json({ msg: "Token verification failed, authorization denied." });
        }
        req.user = verified.id;
        req.token = token;
        next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = verifyUser;