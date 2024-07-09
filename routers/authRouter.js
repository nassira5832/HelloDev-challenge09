const router = require("express").Router();
const userModel = require("../models/user");
const jwtUtil  = require("../utils/jwt");
const hashUtil  = require("../utils/hash");

router.post("/register", async function (req, res) {
    const pseudo = req.body.pseudo;
    const passwd = req.body.passwd;

    if (!pseudo || !passwd)
    {
        res.status(400).json(`Invalid pseudo or passwd`);
        console.error(`!pseudo || !passwd`);
        return;
    }

    try {
        const user = await userModel.findOne({
            pseudo
        });

        if (user) {
            res.status(400).json(`User Already Regitered`);
            console.error(`User Already Regitered`);
            return;
        }

        const hashedPasswd = await hashUtil.hashPasswd(passwd);
        await userModel.create({
            pseudo,
            hashedPasswd
        });

        res.status(200).json(`User Created Successfully`);
    } catch (error) {
        res.status(500).json(`Error in Craeting User`);
        console.error(`Error in Craeting User:${error}`);
    }
});

router.post("/login", async function (req, res) {
    const pseudo = req.body.pseudo;
    const passwd = req.body.passwd;

    if (!pseudo || !passwd)
    {
        res.status(400).json(`Invalid pseudo or passwd`);
        console.error(`!pseudo || !passwd`);
        return;
    }

    try {
        const user = await userModel.findOne({
            pseudo
        });

        if (!user) {
            res.status(400).json(`Invalid User`);
            console.error(`!user`);
            return;
        }

        const isValidPasswd = await hashUtil.comparePasswd(
            passwd,
            user.hashedPasswd
        );

        if (!isValidPasswd) {
            res.status(400).json(`Invalid pseudo or passwd`);
            console.error(`user.passwd !== passwd`);
            return;
        }

        const userToken = jwtUtil.generateToken(user._id);

        res.status(200).json(userToken);
        // console.log(userToken);
    } catch (error) {
        res.status(500).json(`Error in User Login`);
        console.error(`Error in User Login:${error}`);
    }
});


module.exports = router;