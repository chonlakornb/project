const port = 3000;
const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('./db');

const authRoutes = require('./routes/AuthRoutes');
const BuildingRoutes = require('./routes/BuildingRoutes');
const RequestRoutes = require('./routes/RequestRoutes');
const ReportRoutes = require('./routes/ReportRoutes');
const NotificationRoutes = require('./routes/NotificationsRoutes');
const UserRoutes = require('./routes/UserRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const EmployeeRoutes = require('./routes/EmployeeRoutes');
const LiftRoutes = require('./routes/LiftRoutes');

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(express.json());

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    }
    };
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/buildings', BuildingRoutes);
app.use('/api/requests', RequestRoutes);
app.use('/api/requests', RequestRoutes);
app.use('/api/reports', ReportRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api/lifts', LiftRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/employees', EmployeeRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});