import { Request } from 'express';

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            user?: string; // Your custom property
            role?: string; // Your custom property
        }
    }
}
