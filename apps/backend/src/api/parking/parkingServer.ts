import { Request, Response, Router } from "express";
import { getCars } from './endpoints/getCars';
import { postCar, postCarInputValidation } from "./endpoints/postCar";
// import { listCars } from './endpoints/getCars';

export default function parkingServer(): Router {
    const router: Router = Router();

    router.get('/', getCars);
    router.post('/', postCarInputValidation, postCar);
    // router.get('/list', listCars);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /parking/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}