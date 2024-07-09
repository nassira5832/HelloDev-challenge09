const userModel = require("../models/user");
const jwtUtil = require("../utils/jwt");


async function authMiddleware(req, res, next) {
    const userToken = req.headers.authorization;
    // console.log(userToken);

    const userData = jwtUtil.verifyToken(userToken);

    if (!userData) {
        res.json(`Invalid Token`);

        return;
    }

    const id = userData.id;

    try {
        const user = await userModel.findOne({
            _id: id
        });

        if (!user) {
            res.json(`User not Registered`);

            return;
        }

        req.user = user;
        // console.log(req.user.pseudo, req.user._id);
        next();
    } catch (error) {
        res.status(500).json(`Error in Authentification`);
        console.error(`Error in Authentification:${error}`);
    }
}


module.exports = authMiddleware;