import { Request, Response, Router } from 'express';
import admin from '../../middleware/admin';
import {getServices, getServicesInputValidation} from './endpoints/getServices';
import { postService, postServiceInputValidation } from './endpoints/postService';

export default function parkingServer(): Router {
    const router: Router = Router();

    // router.get('/', admin, getOperationsInputValidation, getOperations);
    // router.post('/accept', admin, acceptOperationInputValidation, acceptOperation);

    router.get('/', getServicesInputValidation, getServices);
    router.post('/', postServiceInputValidation, postService);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /services/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}
