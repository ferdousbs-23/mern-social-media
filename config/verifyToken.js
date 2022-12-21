const JWT = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
    if (!req.headers.authorization) {
        //return next(createError(403, 'Please login to view this page.'))
        return res.status(403).send({
            'success': false,
            'msg': 'Authorization token missing'
        });
    }
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.secretOrKey, (err, payload) => {
        if (err) return res.status(401).send({
            'success': false,
            'msg': 'Invalid token'
        });
        req.userId = payload.id;
        next();
    });

}

module.exports = verifyAccessToken;