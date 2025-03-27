import { Request, Response, Router } from "express";
import { getCar, getCarInputValidation } from './endpoints/getCar';
import { postCar, postCarInputValidation } from "./endpoints/postCar";
import { listCars } from './endpoints/listCars';

export default function parkingServer(): Router {
    const router: Router = Router();

    router.get('/car', getCarInputValidation, getCar);
    router.post('/car', postCarInputValidation, postCar);
    // router.get('/list', listCars);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /parking/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}