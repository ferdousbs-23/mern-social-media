const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const verifyAccessToken = require('./config/verifyToken');

//routes files import
const userRoutes = require("./routes/users");   
const authRoutes = require("./routes/auth");   
const postRoutes = require("./routes/posts");   

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Mongodb connected...');
});

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//initialize passport
app.use(passport.initialize());
require('./config/passport')(passport);

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyAccessToken, userRoutes);
app.use('/api/posts', verifyAccessToken, postRoutes);

//start server
app.listen(process.env.port || 5000, () => {
    console.log('server running');
});