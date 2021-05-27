const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const { id, name, username } = decoded;
        req.id = id;
        req.name = name;
        req.username = username;
        next();
    } catch {
        next('Authentication failure!');
    }
};
module.exports = auth;
