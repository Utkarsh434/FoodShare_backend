const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // <-- Import user routes
const donationRoutes = require('./routes/donationRoutes')
require('dotenv').config();

const app = express();

//connect database
connectDB();

//middleware
// CORS Configuration
const corsOptions = {
    origin: ['https://food-share-frontend-taupe.vercel.app/','http://localhost:5173'], // Your frontend URL
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

//Basic route
app.get('/',(req,res)=>{
    res.send("FoodShare Api is running...");
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
