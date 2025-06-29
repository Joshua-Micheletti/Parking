import { Request, Response, Router } from 'express';
import { getCars, getCarsInputValidation } from './endpoints/getCars';
import { postCar, postCarInputValidation } from './endpoints/postCar';
import { deleteCar, deleteCarInputValidation } from './endpoints/deleteCar';

export default function parkingServer(): Router {
    const router: Router = Router();

    router.get('/', getCarsInputValidation, getCars);
    router.post('/', postCarInputValidation, postCar);
    router.delete('/', deleteCarInputValidation, deleteCar);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /parking/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}
