import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

//Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/img`);
    },
    filename: function (req, file, cb) {
        
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

export const uploader = multer({
    storage,
    onError: function (err, next) {
        console.error(err);
        next(err); 
    }
});

