import { Request, Response, Router } from 'express';
import { getOperations, getOperationsInputValidation } from './endpoints/getOperations';
import admin from '../../middleware/admin';
import { acceptOperation, acceptOperationInputValidation } from './endpoints/acceptOperation';

export default function parkingServer(): Router {
    const router: Router = Router();

    router.get('/', admin, getOperationsInputValidation, getOperations);
    router.post('/accept', admin, acceptOperationInputValidation, acceptOperation);

    function healthcheck(req: Request, res: Response): void {
        res.status(200).send('OK healthcheck /operations/healthcheck');
    }

    router.use('/healthcheck', healthcheck);

    return router;
}
