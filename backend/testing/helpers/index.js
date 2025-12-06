/**
 * Test Helper Utilities
 * Assertion helpers and validation utilities
 */

/**
 * Assert transaction status
 */
function assertTransactionStatus(transaction, expectedStatus) {
  if (transaction.status !== expectedStatus) {
    throw new Error(
      `❌ Transaction status mismatch: Expected "${expectedStatus}", got "${transaction.status}"`
    );
  }
  console.log(`✅ Transaction status is "${expectedStatus}"`);
}

/**
 * Assert user role
 */
function assertUserRole(user, expectedRole) {
  if (user.role !== expectedRole) {
    throw new Error(
      `❌ User role mismatch: Expected "${expectedRole}", got "${user.role}"`
    );
  }
  console.log(`✅ User role is "${expectedRole}"`);
}

/**
 * Assert booking status
 */
function assertBookingStatus(booking, expectedStatus) {
  if (booking.status !== expectedStatus) {
    throw new Error(
      `❌ Booking status mismatch: Expected "${expectedStatus}", got "${booking.status}"`
    );
  }
  console.log(`✅ Booking status is "${expectedStatus}"`);
}

/**
 * Assert amount calculated correctly
 */
function assertAmountCorrect(transaction, expectedAmount) {
  if (transaction.amount !== expectedAmount) {
    throw new Error(
      `❌ Amount mismatch: Expected ${expectedAmount}, got ${transaction.amount}`
    );
  }
  console.log(`✅ Amount is correct: ${expectedAmount}`);
}

/**
 * Assert user-admin consistency
 */
function assertConsistency(userData, adminData, fields) {
  for (const field of fields) {
    if (userData[field] !== adminData[field]) {
      throw new Error(
        `❌ Data mismatch in field "${field}": User has "${userData[field]}", Admin has "${adminData[field]}"`
      );
    }
  }
  console.log(`✅ Data consistency verified for fields: ${fields.join(', ')}`);
}

/**
 * Assert validation error
 */
function assertValidationError(error, expectedMessage) {
  if (!error || !error.message.includes(expectedMessage)) {
    throw new Error(
      `❌ Expected validation error containing "${expectedMessage}", got: ${error?.message}`
    );
  }
  console.log(`✅ Validation error correct: "${expectedMessage}"`);
}

/**
 * Assert field exists in response
 */
function assertFieldExists(object, fieldName) {
  if (!(fieldName in object)) {
    throw new Error(
      `❌ Field "${fieldName}" not found in response`
    );
  }
  console.log(`✅ Field "${fieldName}" exists`);
}

/**
 * Assert field does not exist in response
 */
function assertFieldNotExists(object, fieldName) {
  if (fieldName in object) {
    throw new Error(
      `❌ Field "${fieldName}" should not exist in response`
    );
  }
  console.log(`✅ Field "${fieldName}" correctly missing`);
}

/**
 * Assert array contains item with property
 */
function assertArrayContains(array, property, value) {
  if (!array.some(item => item[property] === value)) {
    throw new Error(
      `❌ Array does not contain item with ${property}="${value}"`
    );
  }
  console.log(`✅ Array contains item with ${property}="${value}"`);
}

/**
 * Assert array does not contain item with property
 */
function assertArrayNotContains(array, property, value) {
  if (array.some(item => item[property] === value)) {
    throw new Error(
      `❌ Array should not contain item with ${property}="${value}"`
    );
  }
  console.log(`✅ Array correctly does not contain ${property}="${value}"`);
}

module.exports = {
  assertTransactionStatus,
  assertUserRole,
  assertBookingStatus,
  assertAmountCorrect,
  assertConsistency,
  assertValidationError,
  assertFieldExists,
  assertFieldNotExists,
  assertArrayContains,
  assertArrayNotContains
};
