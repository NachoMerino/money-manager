const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Connection to DB using .env File
mongoose.connect(process.env.DB_URI);
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

const balance = require('./server/controllers/balance.controller.js');

// Get all balances
app.get('/balances', balance.findAll);

// Create a new balance
app.post('/newbalance', balance.create);

// Updating balance
app.put('/balance/:balanceId', balance.update);

app.listen(port, () => console.log(`Listening on port ${port}`));