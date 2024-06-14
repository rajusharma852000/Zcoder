const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

const fetchuser = (req, res, next) => {
    try {
        const authToken = req.header('auth-token');
        if (!authToken) {
            return res.status("400").send("Authenticate using valid token");
        }

        const payload = jwt.verify(authToken, JWT_SECRET);
        req.user = payload.user;
        next();
    }
    catch(error){
        return res.status(401).json({ error: "Please authenticate using valid token" });
    }
}

module.exports = fetchuser;