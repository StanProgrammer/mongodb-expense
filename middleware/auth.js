const jwt = require('jsonwebtoken');
const User = require('../models/users');
const SECRET_KEY = process.env.SECRET_KEY
exports.auth = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        // console.log(token);
        const user = jwt.verify(token, SECRET_KEY);
        // console.log(user)
        User.findById(user.id).then((user) => {
            // console.log(user)
            req.user = user
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};

