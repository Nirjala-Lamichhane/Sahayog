/**
 * Test Setup & Configuration
 * Database initialization, cleanup, and test utilities
 */

const { sequelize, User, Booking, Transaction, Ambulance, Cabin, Report, Rating, Notification } = require('../../src/models');
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
    // Disable foreign key constraints for truncation
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
    
    // Delete in order of dependencies (child tables first)
    await Notification.destroy({ where: {}, truncate: true, cascade: true });
    await Rating.destroy({ where: {}, truncate: true, cascade: true });
    await Report.destroy({ where: {}, truncate: true, cascade: true });
    await Transaction.destroy({ where: {}, truncate: true, cascade: true });
    await Cabin.destroy({ where: {}, truncate: true, cascade: true });
    await Ambulance.destroy({ where: {}, truncate: true, cascade: true });
    await Booking.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    
    // Re-enable constraints
    await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
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
    fullName: 'John Doe',
    age: 30,
    address: 'Kathmandu, Nepal',
    contact: '9841234567',
    department: 'Cardiology',
    doctor: 'Dr. Smith',
    preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredTime: '10:00',
    status: 'pending',
    ...appointmentData
  };

  return await Booking.create(defaultAppointment);
}

/**
 * Create test cabin booking
 */
async function createTestCabinBooking(userId, cabinData = {}) {
  const checkInDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const checkOutDate = new Date(checkInDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  const defaultBooking = {
    userId,
    fullName: 'Jane Smith',
    age: 25,
    contact: '9849876543',
    address: 'Lalitpur, Nepal',
    cabinType: 'Private',
    checkInDate: checkInDate.toISOString().split('T')[0],
    checkOutDate: checkOutDate.toISOString().split('T')[0],
    numberOfAttendants: 1,
    status: 'pending',
    ...cabinData
  };

  return await Cabin.create(defaultBooking);
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

  return await Ambulance.create(defaultRequest);
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
