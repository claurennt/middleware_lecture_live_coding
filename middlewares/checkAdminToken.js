//check admin credentials
const checkAdminToken = (req, res, next) => {
  const { token } = req.body;
  if (!token || token !== process.env.ADMIN_TOKEN)
    return res.status(401).send("Wrong credentials.");
  next();
};

module.exports = checkAdminToken;
