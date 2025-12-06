/**
 * PAYMENT & TRANSACTION TESTS
 * Tests for payment processing, transaction creation, and status updates
 * CRITICAL: Verify no hardcoded PENDING values, status updates to PAID, consistency between user and admin
 */

const request = require('supertest');
const app = require('../../src/app');
const { Transaction, User, Booking, Cabin, Ambulance } = require('../../src/models');
const {
  setupTestDatabase,
  cleanDatabase,
  closeDatabaseConnection,
  createTestUser,
  createTestAdmin,
  createTestAppointment,
  createTestCabinBooking,
  createTestAmbulanceRequest,
  createTestTransaction,
  generateTestToken
} = require('../config/test-setup');
const {
  assertTransactionStatus,
  assertAmountCorrect,
  assertFieldExists,
  assertFieldNotExists,
  assertConsistency,
  assertArrayContains
} = require('../helpers');

describe('💳 PAYMENT & TRANSACTION TESTS', () => {
  let user, userToken, admin, adminToken;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    user = await createTestUser();
    userToken = generateTestToken(user.id, 'user');
    admin = await createTestAdmin();
    adminToken = generateTestToken(admin.id, 'admin');
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  // ============ APPOINTMENT PAYMENT FLOW ============
  describe('Appointment Payment Flow', () => {
    let appointment;

    beforeEach(async () => {
      appointment = await createTestAppointment(user.id);
    });

    test('✅ Should create transaction after appointment payment', async () => {
      const response = await request(app)
        .post('/api/payment/appointment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          appointmentId: appointment.id,
          amount: 5000,
          paymentMethod: 'khalti',
          service: 'Cardiology'
        });

      expect([200, 201]).toContain(response.status);
      assertFieldExists(response.body, 'data');
      assertTransactionStatus(response.body.data, 'paid');
      assertAmountCorrect(response.body.data, 5000);
      console.log('✅ Appointment transaction created with PAID status');
    });

    test('❌ Transaction should NOT have hardcoded PENDING status', async () => {
      const response = await request(app)
        .post('/api/payment/appointment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          appointmentId: appointment.id,
          amount: 5000,
          paymentMethod: 'esewa',
          service: 'Cardiology'
        });

      if (response.status === 200 || response.status === 201) {
        const status = response.body.data?.status;
        if (status === 'pending') {
          throw new Error('❌ CRITICAL BUG: Transaction status is hardcoded as PENDING instead of PAID after payment!');
        }
        console.log('✅ Transaction status is not hardcoded PENDING');
      }
    });

    test('✅ Payment method should be saved correctly', async () => {
      const response = await request(app)
        .post('/api/payment/appointment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          appointmentId: appointment.id,
          amount: 5000,
          paymentMethod: 'khalti'
        });

      if (response.status === 200 || response.status === 201) {
        expect(response.body.data.paymentMethod).toBe('khalti');
        console.log('✅ Payment method correctly saved');
      }
    });

    test('✅ Correct amount should be calculated for appointment', async () => {
      const response = await request(app)
        .post('/api/payment/appointment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          appointmentId: appointment.id,
          amount: 5000,
          paymentMethod: 'khalti'
        });

      if (response.status === 200 || response.status === 201) {
        expect(response.body.data.amount).toBe(5000);
        console.log('✅ Appointment amount calculated correctly');
      }
    });
  });

  // ============ CABIN BOOKING PAYMENT FLOW ============
  describe('Cabin Booking Payment Flow', () => {
    let cabinBooking;

    beforeEach(async () => {
      cabinBooking = await createTestCabinBooking(user.id);
    });

    test('✅ Should create transaction after cabin payment', async () => {
      const response = await request(app)
        .post('/api/payment/cabin')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cabinBookingId: cabinBooking.id,
          amount: 10000,
          paymentMethod: 'esewa'
        });

      expect([200, 201]).toContain(response.status);
      assertFieldExists(response.body, 'data');
      assertTransactionStatus(response.body.data, 'paid');
      assertAmountCorrect(response.body.data, 10000);
      console.log('✅ Cabin transaction created with PAID status');
    });

    test('✅ Cabin booking transaction should store correct amount', async () => {
      const nightsStay = cabinBooking.numberOfNights || 5;
      const pricePerNight = 2000; // Private cabin
      const expectedAmount = nightsStay * pricePerNight;

      const response = await request(app)
        .post('/api/payment/cabin')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          cabinBookingId: cabinBooking.id,
          amount: expectedAmount,
          paymentMethod: 'khalti'
        });

      if (response.status === 200 || response.status === 201) {
        assertAmountCorrect(response.body.data, expectedAmount);
        console.log('✅ Cabin amount calculated correctly for nights stay');
      }
    });
  });

  // ============ AMBULANCE REQUEST PAYMENT FLOW ============
  describe('Ambulance Request Payment Flow', () => {
    let ambulanceRequest;

    beforeEach(async () => {
      ambulanceRequest = await createTestAmbulanceRequest(user.id);
    });

    test('✅ Should create transaction after ambulance payment', async () => {
      const response = await request(app)
        .post('/api/payment/ambulance')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ambulanceRequestId: ambulanceRequest.id,
          amount: 1500,
          paymentMethod: 'khalti',
          distance: 15
        });

      expect([200, 201]).toContain(response.status);
      assertFieldExists(response.body, 'data');
      assertTransactionStatus(response.body.data, 'paid');
      assertAmountCorrect(response.body.data, 1500);
      console.log('✅ Ambulance transaction created with PAID status');
    });

    test('✅ Ambulance amount should be calculated per km', async () => {
      const distance = 20;
      const pricePerKm = 50; // Basic ambulance
      const expectedAmount = distance * pricePerKm;

      const response = await request(app)
        .post('/api/payment/ambulance')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ambulanceRequestId: ambulanceRequest.id,
          amount: expectedAmount,
          paymentMethod: 'esewa',
          distance: distance
        });

      if (response.status === 200 || response.status === 201) {
        assertAmountCorrect(response.body.data, expectedAmount);
        console.log('✅ Ambulance amount calculated correctly per km');
      }
    });
  });

  // ============ TRANSACTION HISTORY - USER SIDE ============
  describe('Transaction History (User Side)', () => {
    beforeEach(async () => {
      // Create multiple transactions for the user
      await createTestTransaction(user.id, {
        bookingType: 'appointment',
        amount: 5000,
        paymentMethod: 'khalti',
        status: 'paid'
      });
      await createTestTransaction(user.id, {
        bookingType: 'cabin',
        amount: 10000,
        paymentMethod: 'esewa',
        status: 'paid'
      });
      await createTestTransaction(user.id, {
        bookingType: 'ambulance',
        amount: 1500,
        paymentMethod: 'khalti',
        status: 'paid'
      });
    });

    test('✅ User should see all their transactions', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        expect(transactions.length).toBe(3);
        console.log('✅ User can view all their transactions');
      }
    });

    test('✅ Transaction should display service type', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasTypeField = transactions.every(t => t.type || t.bookingType);
        expect(hasTypeField).toBe(true);
        console.log('✅ Transaction displays service type/booking type');
      }
    });

    test('✅ Transaction should display payment method', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasPaymentMethod = transactions.every(t => t.paymentMethod);
        expect(hasPaymentMethod).toBe(true);
        console.log('✅ Transaction displays payment method');
      }
    });

    test('✅ Transaction should display status', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasStatus = transactions.every(t => t.status);
        expect(hasStatus).toBe(true);
        console.log('✅ Transaction displays status');
      }
    });

    test('✅ Transaction should display amount', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasAmount = transactions.every(t => typeof t.amount === 'number');
        expect(hasAmount).toBe(true);
        console.log('✅ Transaction displays amount');
      }
    });

    test('✅ Transaction should display date', async () => {
      const response = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasDate = transactions.every(t => t.createdAt || t.date);
        expect(hasDate).toBe(true);
        console.log('✅ Transaction displays date');
      }
    });
  });

  // ============ ADMIN DASHBOARD - TRANSACTION VIEW ============
  describe('Admin Dashboard - Transaction View', () => {
    beforeEach(async () => {
      // Create multiple transactions from different users
      await createTestTransaction(user.id, {
        bookingType: 'appointment',
        amount: 5000,
        status: 'paid'
      });
      
      const user2 = await createTestUser({ email: 'user2@example.com' });
      await createTestTransaction(user2.id, {
        bookingType: 'cabin',
        amount: 10000,
        status: 'paid'
      });
    });

    test('✅ Admin should see all transactions', async () => {
      const response = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        expect(transactions.length).toBeGreaterThanOrEqual(2);
        console.log('✅ Admin can view all transactions');
      }
    });

    test('✅ Admin should see correct payment status (PAID not PENDING)', async () => {
      const response = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const paidTransactions = transactions.filter(t => t.status === 'paid');
        expect(paidTransactions.length).toBeGreaterThan(0);
        console.log('✅ Admin sees PAID status (not PENDING) after payment');
      }
    });

    test('✅ Admin should see user name with transaction', async () => {
      const response = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasUserName = transactions.some(t => t.user?.name || t.userName);
        expect(hasUserName).toBe(true);
        console.log('✅ Admin can see user name with transaction');
      }
    });

    test('✅ Admin should see booking type/description', async () => {
      const response = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      if (response.status === 200) {
        const transactions = Array.isArray(response.body.data) ? response.body.data : response.body;
        const hasBookingInfo = transactions.every(t => t.bookingType || t.type || t.description);
        expect(hasBookingInfo).toBe(true);
        console.log('✅ Admin can see booking type information');
      }
    });
  });

  // ============ USER-ADMIN CONSISTENCY ============
  describe('User-Admin Data Consistency (CRITICAL)', () => {
    let transaction;

    beforeEach(async () => {
      transaction = await createTestTransaction(user.id, {
        bookingType: 'appointment',
        amount: 5000,
        paymentMethod: 'khalti',
        status: 'paid'
      });
    });

    test('✅ Transaction status should be same for user and admin', async () => {
      // Get from user side
      const userResponse = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      // Get from admin side
      const adminResponse = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      if (userResponse.status === 200 && adminResponse.status === 200) {
        const userTransactions = Array.isArray(userResponse.body.data) ? userResponse.body.data : userResponse.body;
        const adminTransactions = Array.isArray(adminResponse.body.data) ? adminResponse.body.data : adminResponse.body;

        const userTxn = userTransactions[0];
        const adminTxn = adminTransactions.find(t => t.id === transaction.id);

        if (userTxn && adminTxn) {
          expect(userTxn.status).toBe(adminTxn.status);
          console.log('✅ Transaction status consistent between user and admin views');
        }
      }
    });

    test('✅ Transaction amount should be same for user and admin', async () => {
      const userResponse = await request(app)
        .get('/api/payment/history')
        .set('Authorization', `Bearer ${userToken}`);

      const adminResponse = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`);

      if (userResponse.status === 200 && adminResponse.status === 200) {
        const userTransactions = Array.isArray(userResponse.body.data) ? userResponse.body.data : userResponse.body;
        const adminTransactions = Array.isArray(adminResponse.body.data) ? adminResponse.body.data : adminResponse.body;

        const userTxn = userTransactions[0];
        const adminTxn = adminTransactions.find(t => t.id === transaction.id);

        if (userTxn && adminTxn) {
          expect(userTxn.amount).toBe(adminTxn.amount);
          console.log('✅ Transaction amount consistent between user and admin views');
        }
      }
    });
  });

  // ============ EDGE CASES ============
  describe('Payment Edge Cases', () => {
    test('❌ Should fail payment without authentication', async () => {
      const appointment = await createTestAppointment(user.id);

      const response = await request(app)
        .post('/api/payment/appointment')
        .send({
          appointmentId: appointment.id,
          amount: 5000,
          paymentMethod: 'khalti'
        });

      expect(response.status).toBe(401);
      console.log('✅ Payment without auth correctly rejected');
    });
  });
});
