// uploadMiddleware.js
import {memoryStorage, StorageEngine} from 'multer';
import multer from 'multer';

// Configure storage
const storage: StorageEngine = memoryStorage();

// Initialize multer with storage configuration
export const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});