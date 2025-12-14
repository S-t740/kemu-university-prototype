import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const newsDir = 'uploads/news';
const eventsDir = 'uploads/events';
const applicationsDir = 'uploads/applications';

[newsDir, eventsDir, applicationsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage for images (news/events)
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine destination based on route
        const dest = req.baseUrl.includes('/news') ? newsDir : eventsDir;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

// Configure storage for application documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, applicationsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).replace(/\s+/g, '_');
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// File filter for documents (PDF/Word) - for applications
const documentFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/octet-stream' // Some systems report this for doc/docx
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
};

// Create multer upload instance for images (default export)
const upload = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 5 // Max 5 files
    }
});

// Create multer upload instance for documents (applications)
export const documentUpload = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size for documents
        files: 6 // Max 6 files (1 CV + 5 supporting docs)
    }
});

export default upload;
