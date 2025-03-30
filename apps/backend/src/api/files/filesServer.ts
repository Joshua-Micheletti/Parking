import { Request, Response, Router } from "express";
// import { getCar, getCarInputValidation } from './endpoints/getCar';
// import { postCar, postCarInputValidation } from "./endpoints/postCar";
// import { listCars } from './endpoints/listCars';
import {uploadInputValidation, upload} from './endpoints/upload';
import { upload as uploadMiddleware } from '../../middleware/upload';

export default function parkingServer(): Router {
    const router: Router = Router();

    router.post('/upload', uploadMiddleware.single('file'), uploadInputValidation, upload);
    // router.get('/download', postCarInputValidation, postCar);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /files/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}