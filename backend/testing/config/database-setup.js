/**
 * Test Setup & Configuration
 * Database initialization, cleanup, and test utilities
 */

const { sequelize, User, Appointment, Transaction, AmbulanceRequest, Cabin, CabinBooking, Report } = require('../src/models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

/**
 * Initialize test database (run before all tests)
 */
async function setupTestDatabase() {
  try {
    await sequelize.sync({ force: true, alter: true });
    console.log('✅ Test database initialized');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  }
}

/**
 * Clean database (run before each test)
 */
async function cleanDatabase() {
  try {
    // Delete in order of dependencies
    await Report.destroy({ where: {}, truncate: true });
    await Transaction.destroy({ where: {}, truncate: true });
    await CabinBooking.destroy({ where: {}, truncate: true });
    await Cabin.destroy({ where: {}, truncate: true });
    await AmbulanceRequest.destroy({ where: {}, truncate: true });
    await Appointment.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
  } catch (error) {
    console.error('❌ Database cleanup failed:', error.message);
    throw error;
  }
}

/**
 * Close database connection
 */
async function closeDatabaseConnection() {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Failed to close database:', error.message);
  }
}

/**
 * Create test user
 */
async function createTestUser(userData = {}) {
  const defaultUser = {
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
    phone: '9841234567',
    role: 'user',
    ...userData
  };

  const user = await User.create(defaultUser);
  return user;
}

/**
 * Create test admin
 */
async function createTestAdmin(userData = {}) {
  const defaultAdmin = {
    email: 'admin@sahayog.com',
    password: 'AdminPassword123!',
    name: 'Test Admin',
    phone: '9800000000',
    role: 'admin',
    ...userData
  };

  const admin = await User.create(defaultAdmin);
  return admin;
}

/**
 * Generate JWT token for testing
 */
function generateTestToken(userId, role = 'user') {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Create test appointment
 */
async function createTestAppointment(userId, appointmentData = {}) {
  const defaultAppointment = {
    userId,
    service: 'Cardiology',
    doctor: 'Dr. Smith',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00',
    status: 'pending',
    ...appointmentData
  };

  return await Appointment.create(defaultAppointment);
}

/**
 * Create test cabin booking
 */
async function createTestCabinBooking(userId, cabinData = {}) {
  const checkInDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const checkOutDate = new Date(checkInDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  const defaultBooking = {
    userId,
    cabinType: 'Private',
    checkInDate,
    checkOutDate,
    numberOfNights: 5,
    status: 'pending',
    ...cabinData
  };

  return await CabinBooking.create(defaultBooking);
}

/**
 * Create test ambulance request
 */
async function createTestAmbulanceRequest(userId, ambulanceData = {}) {
  const defaultRequest = {
    userId,
    fullName: 'John Doe',
    contact: '9841234567',
    pickupLocation: 'Kathmandu',
    dropLocation: 'Lalitpur',
    reason: 'Emergency',
    ambulanceType: 'basic',
    status: 'pending',
    ...ambulanceData
  };

  return await AmbulanceRequest.create(defaultRequest);
}

/**
 * Create test transaction
 */
async function createTestTransaction(userId, transactionData = {}) {
  const defaultTransaction = {
    userId,
    bookingType: 'appointment',
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
    amount: 5000,
    paymentMethod: 'khalti',
    status: 'paid',
    ...transactionData
  };

  return await Transaction.create(defaultTransaction);
}

/**
 * Test data generators
 */
const testDataGenerators = {
  user: createTestUser,
  admin: createTestAdmin,
  appointment: createTestAppointment,
  cabinBooking: createTestCabinBooking,
  ambulanceRequest: createTestAmbulanceRequest,
  transaction: createTestTransaction
};

module.exports = {
  setupTestDatabase,
  cleanDatabase,
  closeDatabaseConnection,
  createTestUser,
  createTestAdmin,
  generateTestToken,
  createTestAppointment,
  createTestCabinBooking,
  createTestAmbulanceRequest,
  createTestTransaction,
  testDataGenerators,
  JWT_SECRET
};
