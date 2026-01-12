const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/hospital',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
  process.exit(1);
});

// Create appointments table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL CHECK (age > 0 AND age <= 150),
      address TEXT NOT NULL,
      contact VARCHAR(20) NOT NULL,
      appointment_number VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
      appointment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log('Appointments table ready');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

createTable();

module.exports = pool;