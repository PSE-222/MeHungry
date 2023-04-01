// A user document: username, id, first + last name, h_psswd
// Test authentication
const db_object = require('../db/config');
const manager_collection = db_object.getDb().collection("Manager");



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
  const hash_passwd = bcrypt.hash(password,10);
  const is_pass_valid = await bcrypt.compare( hash_passwd, user["password"]);

  if (!is_pass_valid) {
    return res
      .status(401)
      .send({ msg: "Invalid Username Or Password!!!" });
  }

  res.status(200).send({logged_in:true, msg: "Login Successfully"});
};

// exports.logout = async (req, res) => {
//   refreshTokens = refreshTokens.filter(
//     (token) => token !== req.body.refreshToken
//   );
//   console.log("refreshTokens array after filtering: ", refreshTokens);

//   return res.status(204).send({ msg: "Logout Successfully!!!" });
// };

// exports.generate_access_token = async (req, res) => {
//   const refreshToken = req.body.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).send({ msg: "Missing Token" });
//   }

//   if (!refreshTokens.includes(refreshToken)) {
//     return res.status(403).send({ msg: "No Permission" });
//   }

//   let tokenUser;

//   jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).send({ msg: "No permission" });
//     }
//     console.log(user);

//     tokenUser = user;
//   });

//   const accessToken = generate_token({ userID: tokenUser.userId, Role: "BO" });
//   console.log("new accessToken: ", accessToken);

//   return res.send({ accessToken });
// };