const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

//routes
const userRoutes = require("./routes/users");   
const authRoutes = require("./routes/auth");   

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Mongodb connected...');
});

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(passport.initialize());
require('./config/passport')(passport);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.port || 5000, () => {
    console.log('server running');
});