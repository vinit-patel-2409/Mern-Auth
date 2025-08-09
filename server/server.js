import express from "express";
import cors from "cors";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();
const port = process.env.PORT || 7840;

app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all origins for easier debugging
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    const allowedOrigins = [
      'https://mern-auth-orpin-mu.vercel.app',
      'https://mern-auth-git-main-vinit-patel-2409s-projects.vercel.app',
      'https://mern-auth-vinit-patel-2409s-projects.vercel.app',
      'https://mern-auth.vercel.app',
      'https://mernauthbyvp.vercel.app',  // Production frontend
      'https://mern-auth-pcxo.onrender.com'  // Production backend
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS error: Origin not allowed -', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cookieParser());

// API endpoints
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // First try the Render deployment path
  const clientBuildPath = path.join(process.cwd(), 'client', 'dist');
  const renderBuildPath = path.join(process.cwd(), 'dist');
  
  // Log the paths for debugging
  console.log('Looking for client build in:', clientBuildPath);
  console.log('Alternative path:', renderBuildPath);
  
  // Serve static files from the client build directory
  app.use(express.static(clientBuildPath, {
    setHeaders: (res, path) => {
      // Set proper MIME type for JavaScript modules
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
  
  // Also try the Render deployment path
  app.use(express.static(renderBuildPath));
  
  // Handle SPA routing - serve index.html for all routes
  app.get('*', (req, res) => {
    // Try the client build path first
    const clientIndexPath = path.join(clientBuildPath, 'index.html');
    const renderIndexPath = path.join(renderBuildPath, 'index.html');
    
    if (fs.existsSync(clientIndexPath)) {
      res.sendFile(clientIndexPath);
    } else if (fs.existsSync(renderIndexPath)) {
      res.sendFile(renderIndexPath);
    } else {
      res.status(404).send('Not found - Build files not found');
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running in development mode");
  });
}

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});