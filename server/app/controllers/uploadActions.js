const multer = require("multer");
const path = require("path");

// Configure multer storage PUBLICATIONS
function getExtension(filename) {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : "";
}

const storagePublication = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.resolve(
      __dirname,
      "../../../client/public/assets/images/uploads/publications"
    );
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-publication.${getExtension(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Seules les images PNG, JPEG et WEBP sont autorisées."),
      false
    );
  }
};

const uploadPublication = multer({
  storage: storagePublication,
  fileFilter,
}).single("file");

const addPublication = async (req, res, next) => {
  uploadPublication(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    return res.status(201).json({
      filePath: `/assets/images/uploads/publications/${req.file.filename}`,
    });
  });
};

// Configure multer storage COVERAGE
const storageCoverage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.resolve(
      __dirname,
      "../../../client/public/assets/images/uploads/coverages"
    );
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-coverage.${getExtension(file.originalname)}`);
  },
});

const uploadCoverage = multer({ storage: storageCoverage, fileFilter }).single(
  "file"
);

const addCoverage = async (req, res, next) => {
  uploadCoverage(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    req.body = {
      id_user: req.body.id_user,
      coverage: `/assets/images/uploads/coverages/${req.file.filename}`,
    };
    return next();
  });
};

// Configure multer storage AVATAR
const storageAvatar = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.resolve(
      __dirname,
      "../../../client/public/assets/images/uploads/avatars"
    );
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-avatar.${getExtension(file.originalname)}`);
  },
});

const uploadAvatar = multer({ storage: storageAvatar, fileFilter }).single(
  "file"
);

const addAvatar = async (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    req.body = {
      id_user: req.body.id_user,
      avatar: `/assets/images/uploads/avatars/${req.file.filename}`,
    };
    return next();
  });
};

module.exports = {
  addPublication,
  addCoverage,
  addAvatar,
};
