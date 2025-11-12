const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('./db');

const authRoutes = require('./routes/AuthRoutes');
const BuildingRoutes = require('./routes/BuildingRoutes');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/buildings', BuildingRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});