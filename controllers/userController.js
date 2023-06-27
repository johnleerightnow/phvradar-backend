const controller = {
  signup: (req, res) => {},
  authMe: (req, res) => {
    console.log("get me");
    try {
      const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
      console.log("decoded", decoded);
      return res.send(decoded);
    } catch (err) {
      console.log(err);
      res.send(null);
    }
    res.send("hello");
  },
};

module.exports = controller;
