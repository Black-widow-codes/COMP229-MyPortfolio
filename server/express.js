
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import projectRoutes from './routes/project.routes.js';
import qualificationRoutes from './routes/qualification.routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', contactRoutes);
app.use('/', projectRoutes);
app.use('/', qualificationRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientPath));

  app.get(/^(?!\/(?:api|auth)(?:\/|$)).*$/, (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: err.message
    });
  }

  next(err);
});

export default app;
