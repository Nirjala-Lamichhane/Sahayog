const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '!@#$%^&*Nirjala',
  database: 'postgres'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return client.query('CREATE DATABASE sahayog;');
  })
  .then(() => {
    console.log('Database "sahayog" created successfully');
    return client.end();
  })
  .catch((err) => {
    if (err.message.includes('already exists')) {
      console.log('Database "sahayog" already exists');
    } else {
      console.error('Error:', err.message);
    }
    client.end();
  });
