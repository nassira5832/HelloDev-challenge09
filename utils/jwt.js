const jwt = require("jsonwebtoken");


const generateToken = function (id) {
    const token = jwt.sign({
            id
        },
        process.env.JWT_SECRET, {
            expiresIn: "604800s"    // 7 days
        }
    );

    return token;
}


const verifyToken = function (token) {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(data);

        return data;
    } catch (error) {
        console.error(`Invalid Token:${error}`);

        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};