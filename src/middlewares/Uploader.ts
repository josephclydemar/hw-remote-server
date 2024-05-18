import path from 'path';
import { v4 as uuid } from 'uuid';
// import dotenv from 'dotenv';
import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';

// dotenv.config();

// const DATABASE_URI: string = process.env.DATABASE_URI || '';

// * For saving uploads to filesystem
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './videos');
    },
    filename: function (req, file, callback) {
        // console.log(file);
        callback(null, `${Date.now()}-${uuid()}${path.extname(file.originalname)}`);
    },
});

// type GridFsFile = {
//     filename: string;
//     bucketName: string;
// };

// // * For saving uploads to database
// const storage = new GridFsStorage({
//     url: DATABASE_URI,
//     file: function (req, file: any): GridFsFile {
//         console.log(file);
//         return {
//             filename: `${file.originalname.split('.')[0]}_${Date.now()}`,
//             bucketName: 'detection_videos',
//         };
//     }
// });

const uploadFiles = multer({ storage: storage }).single('recorded_video');

export { uploadFiles };
