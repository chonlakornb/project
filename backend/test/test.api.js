const request = require('supertest');
const app = require('../server');
const chai = require('chai');
const expect = chai.expect;

describe('API Full Coverage', function() {
  // Placeholders for tokens and IDs
  let userToken = '';
  let adminToken = '';
  let employeeToken = '';
  let buildingId = '';
  let liftId = '';
  let requestId = '';
  let reportId = '';
  let notificationId = '';

  // Auth
  describe('Auth', function() {
    it('should register a new user', async function() {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ fullName: 'Test User', email: 'testuser@example.com', password: 'password123', phone: '1234567890', role: 'user', region: 'A' });
      expect([201, 409]).to.include(res.status);
    });
    it('should not register with missing fields', async function() {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'missing@example.com' });
      expect(res.status).to.equal(400);
    });
    it('should login and get token', async function() {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'password123' });
      expect(res.status).to.equal(200);
      userToken = res.body.token;
    });
    // Add admin/employee login and token assignment here
  });

  // User
  describe('User', function() {
    it('should not get profile without token', async function() {
      const res = await request(app)
        .get('/api/auth/profile');
      expect([401, 403]).to.include(res.status);
    });
    it('should get profile with token', async function() {
      if (!userToken) return this.skip();
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
    });
    // Add update profile, change password, error cases
  });

  // Buildings
  describe('Buildings', function() {
    it('should get buildings (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/buildings');
      expect([401, 403]).to.include(res.status);
    });
    it('should create building (authenticated)', async function() {
      if (!userToken) return this.skip();
      const res = await request(app)
        .post('/api/buildings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test Building', address: '123 Main St', region: 'A', type: 'office', floor: 5 });
      expect([201, 400]).to.include(res.status);
      if (res.body && res.body._id) buildingId = res.body._id;
    });
    it('should get buildings (authenticated)', async function() {
      if (!userToken) return this.skip();
      const res = await request(app)
        .get('/api/buildings')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
    });
    // Add update, delete, error cases, permissions
  });

  // Lifts
  describe('Lifts', function() {
    it('should get lifts (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/lifts');
      expect([401, 403]).to.include(res.status);
    });
    // Add create, update, delete, error cases, permissions
  });

  // Requests
  describe('Requests', function() {
    it('should get all requests', async function() {
      const res = await request(app)
        .get('/api/requests');
      expect(res.status).to.equal(200);
    });
    it('should not create request without token', async function() {
      const res = await request(app)
        .post('/api/requests')
        .send({ title: 'Test', description: 'Test', requestType: 'type', building: 'id' });
      expect([401, 403]).to.include(res.status);
    });
    it('should create request (authenticated)', async function() {
      if (!userToken || !buildingId) return this.skip();
      const res = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Test Request', description: 'Test', requestType: 'type', building: buildingId });
      expect([201, 400]).to.include(res.status);
      if (res.body && res.body._id) requestId = res.body._id;
    });
    // Add update, assign, status, error cases
  });

  // Reports
  describe('Reports', function() {
    it('should get all reports (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/reports');
      expect([401, 403]).to.include(res.status);
    });
    // Add create, update, delete, error cases, permissions
  });

  // Notifications
  describe('Notifications', function() {
    it('should get notifications (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/notifications');
      expect([401, 403]).to.include(res.status);
    });
    // Add create, read, delete, error cases, permissions
  });

  // Admin
  describe('Admin', function() {
    it('should get admin overview (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/admin/overview');
      expect([401, 403]).to.include(res.status);
    });
    // Add authenticated admin tests, permissions
  });

  // Employees
  describe('Employees', function() {
    it('should get employee overview (unauthenticated)', async function() {
      const res = await request(app)
        .get('/api/employees/overview');
      expect([401, 403]).to.include(res.status);
    });
    // Add authenticated employee tests, permissions
  });
});

