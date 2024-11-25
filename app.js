import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middleware/errorHandler.js';
dotenv.config();
const app = express();
app.use(express.json());

// Route
app.use('/', userRoutes);

// Error Handling
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
