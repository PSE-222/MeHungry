// A user document: username, id, first + last name, h_psswd
// Test authentication
const db_object = require('../db/config');
const jwt = require('jsonwebtoken')
const { createHash } = require('crypto');
const manager_collection = db_object.getDb().collection("Manager");
require("dotenv").config();

let refreshTokens = [];

const generate_token = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY, {
    expiresIn: 60 * 600,
    });
};

exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
        .status(401)
        .send({ msg: "Missing Username Or Password!!!" });
    }

    const user = await manager_collection.findOne({ "username": username });
    if (!user) {
        return res.status(404).send({ msg: "User not found" });
    }
    const hash_passwd = createHash('sha256').update(password).digest('hex');
    const is_pass_valid = hash_passwd == user["password"]
    if (!is_pass_valid) {
        return res
        .status(401)
        .send({ msg: "Invalid Username Or Password!!!" });
    }

    const access_token = generate_token({ user_id: user["id"], role: user["role"] });

    const refresh_token = jwt.sign({ user: user["id"], role: user["role"] },process.env.REFRESH_KEY);

    refreshTokens.push(refresh_token);
    console.log({ refreshTokens });

    res.send({ accessToken: access_token, refreshToken: refresh_token });
};


exports.logout = async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.refreshToken);
    // console.log("refreshTokens array after filtering: ", refreshTokens);
    res.status(200).send({ msg: "Logout Successfully!!!" });
};

exports.generate_new_access_token = async (req, res) => {
    const refresh_token = req.body.refreshToken;

    if (!refresh_token) {
        return res.status(401).send({ msg: "Missing Token" });
    }

    if (!refreshTokens.includes(refresh_token)) {
        return res.status(403).send({ msg: "No Permission" });
    }

    let token_user;

    jwt.verify(refresh_token, process.env.REFRESH_KEY, (err, user) => {
        if (err) {
        return res.status(403).send({ msg: "No permission" });
        }
        console.log(user);

        token_user = user;
    });

    const access_token = generate_token({ user_id: token_user["user_id"], role: token_user["role"] });
    console.log("new access token: ", access_token);

    return res.send({ accessToken: access_token });
};