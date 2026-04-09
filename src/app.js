const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const urlRoutes = require('./routes/url.routes');
console.log("Imported Routes:", urlRoutes);
app.use('/', urlRoutes); 
console.log("Routes loaded ");

console.log("ENV VALUE:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected "))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Server is running ");
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});