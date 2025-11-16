const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('./db');

const authRoutes = require('./routes/AuthRoutes');
const BuildingRoutes = require('./routes/BuildingRoutes');
const RequestRoutes = require('./routes/RequestRoutes');
const ReportRoutes = require('./routes/ReportRoutes');
const NotificationRoutes = require('./routes/NotificationsRoutes');
const AdminRoutes = require('./routes/AdminRoutes');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/buildings', BuildingRoutes);
app.use('/api/requests', RequestRoutes);
app.use('/api/requests', RequestRoutes);
app.use('/api/reports', ReportRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api/admin', AdminRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});