const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  auth: function (req, res, next) {
    const auth_header = req.headers["authorization"];
    const access_token = auth_header && auth_header.split(" ")[1];
    if (!access_token) {
      return res
        .status(403)
        .send({ msg: "Access denied due to missing token" });
    }

    console.log({ access_token: access_token });

    jwt.verify(access_token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).send({ msg: "No permission" });
      }
	  if (!user["user_id"] || !user["role"]){
		return res.status(403).send({ msg: "Invalid User" });
	  }
      req.user = user;
      next();
    });
  },
};