const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body.formData;
    const hashedPassword = await argon2.hash(password, hashingOptions);

    delete req.body.formData.password;
    req.body.formData.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
};

const hashChangePassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password) {
      const hashedPassword = await argon2.hash(password, hashingOptions);

      delete req.body.password;
      req.body.password = hashedPassword;
    }

    next();
  } catch (err) {
    next(err);
  }
};

const verifyToken = (req, res, next) => {
  try {
    // Check for the presence of the "Authorization" header in the request
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    // Check that the header is in the form "Bearer <token>"
    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    // Check the validity of the token (its authenticity and expiration date)
    // On success, the payload is extracted and decoded
    req.auth = jwt.verify(token, process.env.APP_SECRET);

    next();
  } catch (err) {
    console.error(err);

    res.sendStatus(401);
  }
};

const verifyProfileAccess = (req, res, next) => {
  if (req.auth.assignment === "admin") {
    return next();
  }

  const accountId = req.auth.sub; // Assuming 'sub' is the user ID in the token payload
  let requestId;

  if (req.body.id_account) {
    requestId = parseInt(req.body.id_account, 10); // Assuming the URL is /profil/:id
  } else {
    requestId = parseInt(req.params.id, 10); // Assuming the URL is /profil/:id
  }

  if (accountId !== requestId) {
    return res.status(404).json({ access: "denied" });
  }

  return next();
};

module.exports = {
  hashPassword,
  hashChangePassword,
  verifyToken,
  verifyProfileAccess,
};
