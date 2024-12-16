// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import passport from 'passport';
import cors from 'cors';
// import { errorMiddleware } from './middleware/errorMiddleware';
import apiRoutes from './routes/apiRoutes';
import { configurePassport } from './config/passport';
import sequelize from './config/database';
import { analyticsMiddleware } from './middleware/analyticsMiddleware';
import { authenticateUser } from './middleware/authMiddleware';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Specify the port number for the server
const port: number = parseInt(process.env.PORT || '8080', 10);

// Use middleware to secure the application
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(authMiddleware)

// Initialize Passport
app.use(passport.initialize());
configurePassport();

// Analytics middleware
app.use(analyticsMiddleware);

// Routes
app.use('/api/v1', apiRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});



// Error handling middleware
// app.use(errorMiddleware);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}).catch((error: any) => {
  console.error('Unable to connect to the database:', error);
});
