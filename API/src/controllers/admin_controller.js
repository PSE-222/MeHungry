// A user document: username, id, first + last name, h_psswd
// Test authentication
const db_object = require('../db/config');
const manager_collection = db_object.getDb().collection("Manager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let refreshTokens = [];

const generate_token = (user) => {
  return jwt.sign(user, process.env.ACCESS_KEY, {
    expiresIn: 60 * 60,
  });
};

// exports.register = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;

//   // should handle in frontend
//   if (!email || !password || !confirmPassword) {
//     return res
//       .status(401)
//       .send({ msg: "Missing email address or password" });
//   }

//   if (password !== confirmPassword) {
//     return res
//       .status(401)
//       .send({ msg: "The password confirmation does not match" });
//   }

//   const user = await db.collection("BOs").findOne({ "Email Address": email });

//   if (user) {
//     return res.status(409).send({ msg: "Email address already exists" });
//   }

//   // generate ID
//   const ran = Math.floor(Math.random() * 9000 + 1000);
//   const id = `B${ran}`;
//   const checkId = await db.collection("BOs").findOne({ ID: id });

//   if (checkId) {
//     return res.status(500).send({ msg: "ID already exists" });
//   }

//   const newUser = {
//     ID: id,
//     "Email Address": email,
//     Password: await bcrypt.hash(password, 10),
//     Role: "BO",
//   };

//   await db.collection("BOs").insertOne(newUser);

//   return res.send({ msg: "Successfully register new BO account" });
// };

exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // should handle in frontend
  if (!username || !password) {
    return res
      .status(401)
      .send({ msg: "Missing Username Or Password!!!" });
  }

  const user = await manager_collection.findOne({ "username": username });
  const isPassValid = await bcrypt.compare(password, user["password"]);

  if (!isPassValid) {
    return res
      .status(401)
      .send({ msg: "Invalid Username Or Password!!!" });
  }

  const accessToken = generate_token({ id: user["id"], name: user["first_name"] });

  const refreshToken = jwt.sign(
    { id: user["id"], name: user["first_name"] },
    process.env.REFRESH_KEY
  );

  refreshTokens.push(refreshToken);
  console.log({ refreshTokens });

  return res.send({ accessToken, refreshToken });
};

exports.logout = async (req, res) => {
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.refreshToken
  );
  console.log("refreshTokens array after filtering: ", refreshTokens);

  return res.status(204).send({ msg: "Logout Successfully!!!" });
};

exports.generate_access_token = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).send({ msg: "Missing Token" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).send({ msg: "No Permission" });
  }

  let tokenUser;

  jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ msg: "No permission" });
    }
    console.log(user);

    tokenUser = user;
  });

  const accessToken = generate_token({ userID: tokenUser.userId, Role: "BO" });
  console.log("new accessToken: ", accessToken);

  return res.send({ accessToken });
};