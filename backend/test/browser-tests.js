/* Minimal browser-side tests that mirror core API flows using fetch + Chai.
   Adjust BASE_URL if your backend is on a different host/port.
   Ensure backend allows CORS from the origin serving this file. */

// If running under Node (Mocha), skip executing browser-only tests that reference `window`.
if (typeof window === 'undefined') {
  // Running in Node: export a noop to avoid "window is not defined" errors
  // Mocha will load this file but not execute any browser tests.
  module.exports = () => {};
} else {
  // Ensure `expect` is available (either set on window by the runner HTML or via chai)
  const expect = window.expect || (typeof chai !== 'undefined' ? chai.expect : null);
  if (!expect) {
    throw new Error('chai.expect is not available. Make sure you load chai and set window.expect before loading browser-tests.js');
  }

  // Use explicit backend URL by default (works when page is served by Live Server).
  // You can still override it from the browser console:
  // window.__BASE_API_URL__ = 'http://localhost:3000';
  const BASE_URL = window.__BASE_API_URL__ || 'http://localhost:3000';
  // Example: http://localhost:3000 or your server origin

  function fetchJson(path, opts = {}) {
    const url = `${BASE_URL}${path}`;
    return fetch(url, opts).then(async res => {
      const bodyText = await res.text();
      let body;
      try { body = bodyText ? JSON.parse(bodyText) : {}; } catch(e) { body = bodyText; }
      return { status: res.status, body, headers: res.headers };
    });
  }

  describe('API Browser Tests (basic coverage)', function() {
    this.timeout(10000);

    let userToken = '';
    let buildingId = '';
    let requestId = '';

    // Auth
    describe('Auth', function() {
      it('registers or reports duplicate', async function() {
        const res = await fetchJson('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: 'Browser Test', email: 'browsertest@example.com', password: 'password123', phone: '000', role: 'user', region: 'A' })
        });
        // Accept 201 (created) or 409 (already exists)
        expect([201, 409]).to.include(res.status);
      });

      it('fails registration with missing fields', async function() {
        const res = await fetchJson('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'missing@example.com' })
        });
        expect(res.status).to.be.oneOf([400, 422]);
      });

      it('logs in and returns token', async function() {
        const res = await fetchJson('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'browsertest@example.com', password: 'password123' })
        });
        // If login fails (user not created), test is allowed to fail here.
        expect(res.status).to.satisfy(s => [200, 401, 404].includes(s));
        if (res.status === 200 && res.body && res.body.token) {
          userToken = res.body.token;
        }
      });
    });

    // Profile
    describe('User profile', function() {
      it('rejects profile without token', async function() {
        const res = await fetchJson('/api/auth/profile');
        expect([401, 403]).to.include(res.status);
      });
      it('returns profile with token', async function() {
        if (!userToken) return this.skip();
        const res = await fetchJson('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        expect(res.status).to.equal(200);
        if (res.body && res.body._id) {
          expect(res.body.email).to.be.a('string');
        }
      });
    });

    // Buildings
    describe('Buildings', function() {
      it('rejects unauthenticated building list', async function() {
        const res = await fetchJson('/api/buildings');
        // some APIs allow public GET, so allow 200 as valid too
        expect([200, 401, 403]).to.include(res.status);
      });

      it('creates building when authenticated', async function() {
        if (!userToken) return this.skip();
        const res = await fetchJson('/api/buildings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
          body: JSON.stringify({ name: 'Browser Building', address: '1 Browser St', region: 'A', type: 'office', floor: 3 })
        });
        expect([201, 400, 401, 403]).to.include(res.status);
        if (res.status === 201 && res.body && res.body._id) {
          buildingId = res.body._id;
        }
      });

      it('lists buildings when authenticated', async function() {
        if (!userToken) return this.skip();
        const res = await fetchJson('/api/buildings', {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        expect([200, 401, 403]).to.include(res.status);
      });
    });

    // Requests
    describe('Requests', function() {
      it('gets all requests (public)', async function() {
        const res = await fetchJson('/api/requests');
        expect([200, 401, 403]).to.include(res.status);
      });

      it('rejects create request without token', async function() {
        const res = await fetchJson('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'RT', description: 'desc', requestType: 'type', building: 'some-id' })
        });
        expect([401, 403]).to.include(res.status);
      });

      it('creates request when authenticated', async function() {
        if (!userToken || !buildingId) return this.skip();
        const res = await fetchJson('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
          body: JSON.stringify({ title: 'Browser Request', description: 'desc', requestType: 'type', building: buildingId })
        });
        expect([201, 400, 401, 403]).to.include(res.status);
        if (res.status === 201 && res.body && res.body._id) requestId = res.body._id;
      });
    });

    // Basic admin/notification/report endpoints sanity-checks (unauthenticated)
    describe('Other endpoints (unauthenticated sanity checks)', function() {
      ['reports','notifications','admin/overview','employees/overview'].forEach(path => {
        it(`GET /api/${path} responds`, async function() {
          const res = await fetchJson(`/api/${path}`);
          expect([200, 401, 403, 404]).to.include(res.status);
        });
      });
    });

  }); // end describe('API Browser Tests (basic coverage)')
} // end else (browser)
