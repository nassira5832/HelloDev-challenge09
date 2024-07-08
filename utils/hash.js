const bcrypt = require("bcrypt");


async function hashPasswd(passwd) {
    const salt = await bcrypt.genSalt(10);
    // console.log("From hashPasswd:", passwd, salt);
    let hashedPasswd = bcrypt.hash(passwd, salt);

    return hashedPasswd;
};

async function comparePasswd(passwd, hashedPasswd) {
    // console.log("From comparePasswd:",passwd, hashedPasswd);
    let isValidPasswd = await bcrypt.compare(passwd, hashedPasswd);

    return isValidPasswd;
};


module.exports = {
    hashPasswd,
    comparePasswd
};