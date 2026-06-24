import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Ziptrrip Todo API is running');
});


app.use('/api/todos', todoRoutes);

if (MONGO_URI) {
    mongoose
        .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((error) => {
            console.log('MongoDB connection failed:', error.message);
        });
} else {
    console.log('MONGO_URI is missing. Add it to your .env file to connect MongoDB.');
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
