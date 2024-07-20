const multer = require("multer");
const path = require("path");

// // Configure multer storage ARTWORKS
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     const uploadPath = path.resolve(
//       __dirname,
//       "../../../client/public/assets/images/artworks"
//     );
//     cb(null, uploadPath);
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage }).single("file");

// const addArtwork = async (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return next(err);
//     }
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     return res.status(201).json({ filePath: `/artworks/${req.file.filename}` });
//   });
// };


// Configure multer storage PUBLICATIONS
function getExtension(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : '';
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
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error("Seules les images PNG, JPEG et WEBP sont autorisées."), false); // Refuser le fichier
  }
};

const uploadPublication = multer({ storage: storagePublication, fileFilter }).single("file");

const addPublication = async (req, res, next) => {
  uploadPublication(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    return res
      .status(201)
      .json({ filePath: `/assets/images/uploads/publications/${req.file.filename}` });
  });
};

module.exports = {
  addPublication,
};
