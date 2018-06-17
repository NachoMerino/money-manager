const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Connection to DB using .env File
// mongoose.connect(process.env.DB_URI);

// Connection to the LOCAL database
const dbConfig = require('./server/DBconfig/database.config.js');
mongoose.connect(dbConfig.url);
// common for both connections
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB Connection established");
});

db.on("error", (err) => {
  console.log('Error',err);
});

// Using Body Parser Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//DB model

const account = require('./server/controllers/account.controller.js');

// Get all accounts
app.get('/accounts', account.findAll);

// Create a new account
app.post('/newaccount', account.create);

// Updating account
app.put('/account/:accountId', account.update);

// Updating with offline data
app.put('/offlineupdate', account.offlineupdate);

// Delete account
app.delete('/deleteaccount/:accountId', account.delete);



app.listen(port, () => console.log(`Listening on port ${port}`));