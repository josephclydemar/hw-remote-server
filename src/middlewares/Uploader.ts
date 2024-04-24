import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './videos');
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadFiles = multer({ storage: storage }).single('recorded_video');

export { uploadFiles };