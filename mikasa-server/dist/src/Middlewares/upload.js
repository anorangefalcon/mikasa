import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, "latestScreenshot" + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
export { upload };
