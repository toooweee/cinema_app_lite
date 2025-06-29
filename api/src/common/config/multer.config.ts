import * as multer from 'multer';
import { extname, join } from 'path';
import * as uuid from 'uuid';
import * as process from 'node:process';

export const multerConfig = {
  storage: multer.diskStorage({
    destination: join(process.cwd(), 'uploads'),
    filename: (req, file, cb) => {
      const uniqueSuffix = uuid.v4();
      const extension = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
};
