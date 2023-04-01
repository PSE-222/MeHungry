// module.exports = {
//   auth: function (req, res, next) {
    
// 	const authHeader = req.headers["authorization"];
//     const accessToken = authHeader && authHeader.split(" ")[1];
//     if (!accessToken) {
//       return res
//         .status(403)
//         .send({ msg: "Access denied due to missing token" });
//     }

//     console.log({ accessToken });

//     jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
//       if (err) {
//         return res.status(403).send({ msg: "No permission" });
//       }
// 	  if (!user["id"] || !user["name"]){
// 		return res.status(403).send({ msg: "Invalid User" });
// 	  }
//       req.user = user;
//       next();
//     });
//   },
// };