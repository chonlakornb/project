const port = 3000;
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

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

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5503'];

app.use(express.json());

const corsOptions = {
    // Allow explicit allowedOrigins OR any localhost/127.0.0.1 on any port (covers Live Server)
    origin: (origin, callback) => {
        // allow requests with no origin (e.g. curl, native apps)
        if (!origin) return callback(null, true);

        // quick whitelist match
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // allow localhost or 127.0.0.1 on any port (Live Server typically uses :5500+)
        const localhostRegex = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
        if (localhostRegex.test(origin)) {
            return callback(null, true);
        }

        // otherwise block
        callback(new Error('Not allowed by CORS'));
    }
};
app.use(cors(corsOptions));

// Serve test runner files (browser mocha page) same-origin at /tests
app.use('/tests', express.static(path.join(__dirname, 'test')));

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

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Browser tests available at http://localhost:${port}/tests/browser-test.html`);
    });
}

module.exports = app;